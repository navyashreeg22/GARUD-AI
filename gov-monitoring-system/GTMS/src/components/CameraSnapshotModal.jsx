import React from 'react';
import { Camera, X, ShieldAlert, Cpu, Eye, CheckCircle2, Download } from 'lucide-react';

export default function CameraSnapshotModal({ isOpen, onClose, attendanceData, centreId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-900/60 text-blue-300 border border-blue-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">YOLO AI Vision Snapshot Inspection</h3>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-mono font-semibold">
                  AUDIT EVIDENCE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centre: <span className="font-mono text-slate-200">{centreId}</span> • Stream Source: <span className="font-mono text-slate-200">{attendanceData.camera_id || 'CAM-04-MAIN'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Simulated CCTV Camera Feed with YOLO Bounding Boxes */}
          <div className="relative w-full h-80 bg-slate-950 rounded-lg overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between p-4">
            {/* Top HUD */}
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 z-10 bg-slate-950/70 p-2 rounded border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="font-bold text-rose-400">REC [ARCHIVE SNAPSHOT]</span>
                <span className="text-slate-400">|</span>
                <span>YOLOv11-OBB DETECTOR</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300 text-[11px]">
                <span>CONF: <strong className="text-emerald-400">{attendanceData.confidence_score || '98.4'}%</strong></span>
                <span>SYNC: <strong className="text-white">{attendanceData.timestamp || '09:30:14 AM'}</strong></span>
                <span>FPS: 30.0</span>
              </div>
            </div>

            {/* Visual Classroom Grid Simulation with YOLO Bounding Boxes */}
            <div className="absolute inset-0 pt-16 pb-12 px-8 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full border border-dashed border-slate-800 grid grid-cols-6 grid-rows-3 gap-3 relative opacity-90">
                {/* Simulated Bounding Boxes */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-emerald-400/80 bg-emerald-500/10 rounded text-[9px] font-mono text-emerald-300 p-1 flex flex-col justify-between relative"
                  >
                    <span className="bg-emerald-950/80 px-1 py-0.2 rounded w-fit text-[8px] text-emerald-300 border border-emerald-700">
                      Trainee #{i + 1} (0.97)
                    </span>
                    <div className="self-end text-[7px] text-emerald-400">Head/Torso</div>
                  </div>
                ))}
              </div>

              {/* Watermark notice */}
              <div className="absolute text-center bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-700 pointer-events-auto">
                <div className="text-xs font-mono text-slate-300 font-semibold">
                  Detected Human Entities: <span className="text-emerald-400 font-bold text-sm">{attendanceData.ai_detected}</span> Individuals
                </div>
                <div className="text-[11px] text-rose-300 mt-0.5">
                  Missing vs Manual Register: <span className="font-bold">-{attendanceData.discrepancy_variance} Unverified Trainees</span>
                </div>
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10 bg-slate-950/70 p-2 rounded border border-slate-800/80 backdrop-blur-xs">
              <span className="flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Model: edge-cv-yolo-v11-vocational</span>
              </span>
              <span className="text-emerald-400 font-semibold">Verification Flag: Tamper-Evident Hash #9A4F2</span>
            </div>
          </div>

          {/* Audit Verification Details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Manual Roll Call Claimed</span>
              <span className="text-lg font-bold font-mono text-slate-900">{attendanceData.manual_reported}</span>
              <span className="text-slate-500 text-[11px] block">By Centre Instructor</span>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
              <span className="text-blue-700 block text-[11px]">AI Vision Detected</span>
              <span className="text-lg font-bold font-mono text-blue-900">{attendanceData.ai_detected}</span>
              <span className="text-blue-600 text-[11px] block">YOLO Bounding Box Verified</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
              <span className="text-rose-700 block text-[11px]">Audit Discrepancy</span>
              <span className="text-lg font-bold font-mono text-rose-700">-{attendanceData.discrepancy_variance}</span>
              <span className="text-rose-600 text-[11px] block">Pending Official Reconciliation</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Audit Frame Hash: <span className="font-mono">sha256:7b1e8...3a9c</span>
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => alert("Audit evidentiary package downloaded (PDF/JPEG metadata bundle).")}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Package</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors"
            >
              Close Snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
