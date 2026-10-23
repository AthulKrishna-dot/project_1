// components/common/AlertCard.tsx
import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type { Alert } from '../../types';
import { alertSeverityColor, alertIconColor } from '../../utils/alertUtils';

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const IconComponent =
    alert.severity === 'critical'
      ? AlertCircle
      : alert.severity === 'warning'
      ? AlertTriangle
      : Info;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${alertSeverityColor(alert.severity)}`}>
      <IconComponent
        size={16}
        className={`shrink-0 mt-0.5 ${alertIconColor(alert.severity)}`}
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{alert.title}</p>
        <p className="text-xs mt-0.5 leading-snug opacity-80">{alert.message}</p>
      </div>
    </div>
  );
}
