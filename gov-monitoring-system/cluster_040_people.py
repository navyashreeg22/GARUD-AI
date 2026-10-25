import cv2, json
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
cap = cv2.VideoCapture(r'C:\Users\Drishti Telkar\.gemini\antigravity\040.avi')
fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

all_person_detections = []

# sample every 50 frames (2 seconds) for first 60 seconds
for frame_no in range(0, 1500, 50):
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
    ret, frame = cap.read()
    if not ret:
        break
    
    results = model(frame, conf=0.15, verbose=False)
    for r in results:
        for box in r.boxes:
            if int(box.cls[0]) == 0:
                conf = float(box.conf[0])
                xywh = [float(x) for x in box.xywh[0]]
                cx, cy, rw, rh = xywh[0]/w, xywh[1]/h, xywh[2]/w, xywh[3]/h
                all_person_detections.append({
                    'frame': frame_no,
                    'conf': conf,
                    'cx': cx,
                    'cy': cy,
                    'rw': rw,
                    'rh': rh
                })

cap.release()

# Cluster the detections into 8 distinct person locations
# Using simple spatial clustering (K-Means with k=8)
import numpy as np

pts = np.array([[p['cx'], p['cy']] for p in all_person_detections])
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.001)
_, labels, centers = cv2.kmeans(pts.astype(np.float32), 8, None, criteria, 10, cv2.KMEANS_PP_CENTERS)

clusters = []
for k in range(8):
    cluster_pts = [all_person_detections[i] for i in range(len(labels)) if labels[i][0] == k]
    if cluster_pts:
        avg_cx = float(np.mean([p['cx'] for p in cluster_pts]))
        avg_cy = float(np.mean([p['cy'] for p in cluster_pts]))
        avg_rw = float(np.mean([p['rw'] for p in cluster_pts]))
        avg_rh = float(np.mean([p['rh'] for p in cluster_pts]))
        clusters.append({
            'cx': round(avg_cx, 4),
            'cy': round(avg_cy, 4),
            'rw': round(max(0.04, min(0.14, avg_rw)), 4),
            'rh': round(max(0.06, min(0.35, avg_rh)), 4),
            'count': len(cluster_pts)
        })

# Sort front to back / left to right
clusters.sort(key=lambda c: (c['cy'], c['cx']))

people = []
for idx, c in enumerate(clusters):
    is_standing = c['rh'] > 0.20 or c['cy'] > 0.55
    pose = "Standing Center Aisle (Instructor)" if (is_standing and 0.40 < c['cx'] < 0.60) else (
        "Standing / Moving" if is_standing else f"Desk Station #{idx+1} (Sitting)"
    )
    people.append({
        "id": f"TR-{idx+1:02d}",
        "pose": pose,
        "cx": c['cx'],
        "cy": c['cy'],
        "rw": c['rw'],
        "rh": c['rh']
    })

print(f"Computed {len(people)} people stations:")
print(json.dumps(people, indent=2))

with open('cctv_8_people.json', 'w') as f:
    json.dump(people, f, indent=2)
