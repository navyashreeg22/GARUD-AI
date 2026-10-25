from ultralytics import YOLO
import cv2, json

model = YOLO('yolov8n.pt')
img = cv2.imread('public/test_040_frame0.jpg')
h, w, _ = img.shape

results = model('public/test_040_frame0.jpg', conf=0.18)
persons = []
for r in results:
    for box in r.boxes:
        if int(box.cls[0]) == 0:
            conf = float(box.conf[0])
            xywh = [float(x) for x in box.xywh[0]]
            cx, cy, rw, rh = xywh[0]/w, xywh[1]/h, xywh[2]/w, xywh[3]/h
            persons.append({
                'conf': conf,
                'cx': round(cx, 4),
                'cy': round(cy, 4),
                'rw': round(rw, 4),
                'rh': round(rh, 4)
            })

# NMS deduplication
unique_persons = []
persons.sort(key=lambda p: p['conf'], reverse=True)
for p in persons:
    is_dup = False
    for up in unique_persons:
        # check distance or IoU
        dx = abs(p['cx'] - up['cx'])
        dy = abs(p['cy'] - up['cy'])
        if dx < 0.05 and dy < 0.08:
            is_dup = True
            break
    if not is_dup:
        unique_persons.append(p)

print(f'Total unique persons detected: {len(unique_persons)}')
unique_persons.sort(key=lambda p: (p['cy'], p['cx']))

# Output formatted JSON
data = []
for idx, p in enumerate(unique_persons):
    pose = "Sitting / Lab Bench" if p['rh'] < 0.35 else "Standing / Instructor"
    data.append({
        "id": f"TR-{idx+1:02d}",
        "pose": pose,
        "cx": p['cx'],
        "cy": p['cy'],
        "rw": p['rw'],
        "rh": p['rh']
    })

print(json.dumps(data, indent=2))
with open('cctv_040_people.json', 'w') as f:
    json.dump(data, f, indent=2)
