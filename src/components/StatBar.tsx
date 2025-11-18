// src/components/StatBar.tsx

import React from 'react';
import { Heart, Zap, Battery, Icon as IconType } from 'lucide-react';

// Définir les icônes disponibles pour le type
const IconMap: { [key: string]: React.ComponentType<any> } = { 
  hp: Heart,
  energie: Zap,
  fatigue: Battery,
};

interface StatBarProps {
    type: 'hp' | 'energie' | 'fatigue'; // Type de la barre
    current: number; // Valeur actuelle
    max: number; // Valeur maximale
    label: string; // Nom affiché (ex: "Santé", "Mana")
    color: string; // Couleur de la barre (ex: "red-500", "blue-500")
}

const StatBar: React.FC<StatBarProps> = ({ type, current, max, label, color }) => {
    // Calcul du pourcentage pour la barre de progression
    const percentage = Math.max(0, (current / max) * 100);
    
    // Sélection de l'icône
    const Icon = IconMap[type] || Heart;

    // Ajustement de la couleur du texte si c'est la fatigue
    const textColor = type === 'fatigue' ? 'text-gray-400' : 'text-white';
    
    // Le style pour la barre de fatigue est inversé (plus la fatigue est basse, mieux c'est)
    const progressBarColor = type === 'fatigue' 
        ? (percentage > 75 ? 'bg-red-500' : 'bg-green-500') 
        : `bg-${color}`;

    return (
        <div className="mb-2 p-2 bg-gray-700 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-1">
                <div className={`flex items-center font-bold text-sm ${textColor}`}>
                    <Icon className={`w-4 h-4 mr-2 ${type === 'fatigue' ? 'text-gray-400' : `text-${color}`}`} />
                    {label}
                </div>
                <span className={`text-sm ${textColor}`}>
                    {Math.round(current)} / {max}
                </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${progressBarColor}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default StatBar;