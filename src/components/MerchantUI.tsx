// src/components/MerchantUI.tsx

import React from 'react';
import { X, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { 
    CharacterType, ConsumableItem, ShopItem, StatKey 
} from '../types/game';

// --- Interface des Props ---
interface MerchantUIProps {
    character: CharacterType | null;
    gold: number;
    inventory: ConsumableItem[];
    merchantItems: ShopItem[];
    handleToggleMerchant: () => void;
    handleBuyItem: (item: ShopItem) => void;
    handleSellItem: (item: ConsumableItem) => void;
}

const MerchantUI: React.FC<MerchantUIProps> = ({
    character,
    gold,
    inventory,
    merchantItems,
    handleToggleMerchant,
    handleBuyItem,
    handleSellItem
}) => {
    if (!character) return null;

    // Helper pour afficher les stats requises
    const renderRequirements = (item: ShopItem) => {
        const reqs = [];
        if (item.reqForce) reqs.push(`Force: ${item.reqForce}`);
        if (item.reqInt) reqs.push(`Int: ${item.reqInt}`);
        
        if (reqs.length === 0) return null;
        
        return (
            <div className="text-xs text-yellow-400 mt-1">
                Req: {reqs.join(', ')}
            </div>
        );
    };

    // Helper pour vérifier si le personnage peut acheter
    const canBuy = (item: ShopItem) => {
        return gold >= item.cost;
    };

    // Helper pour vérifier si le personnage peut équiper (si nous avions la logique complète d'équipement)
    const meetsEquipRequirements = (item: ShopItem) => {
        const meetsForce = !item.reqForce || character.force >= item.reqForce;
        const meetsInt = !item.reqInt || character.intelligence >= item.reqInt;
        return meetsForce && meetsInt;
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-95 p-6 z-20 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700">
                    <h1 className="text-3xl font-bold text-yellow-300 flex items-center">
                        <ShoppingCart className="mr-3 w-7 h-7" /> 
                        Boutique du Marchand Itinérant
                    </h1>
                    <button 
                        onClick={handleToggleMerchant} 
                        className="p-3 bg-red-600 hover:bg-red-500 rounded-full transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="text-xl mb-6 text-right text-gray-200">
                    <DollarSign className="inline-block w-5 h-5 mr-1 text-yellow-500" />
                    Votre Or : <span className="font-bold text-yellow-500">{gold}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* --- Section Achat --- */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
                            <Package className="mr-2 w-5 h-5" /> 
                            Articles à Vendre
                        </h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {merchantItems.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`p-3 rounded-lg border ${canBuy(item) ? 'border-gray-600' : 'border-red-600 opacity-60'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-lg text-white">{item.name} <span className="text-sm text-gray-400">({item.grade})</span></div>
                                            <div className="text-sm text-gray-400">
                                                {item.type === 'weapon' && `Dégâts: ${item.damage}`}
                                                {item.type === 'armor' && `Défense: ${item.defense}`}
                                                {item.type === 'consumable' && `Effet: ${item.effect} (+${item.value})`}
                                            </div>
                                            {renderRequirements(item)}
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="font-bold text-yellow-500 flex items-center">
                                                <DollarSign className="w-4 h-4 mr-1" />{item.cost}
                                            </div>
                                            <button
                                                onClick={() => handleBuyItem(item)}
                                                disabled={!canBuy(item)}
                                                className={`mt-2 px-3 py-1 text-sm rounded transition 
                                                    ${canBuy(item) ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 cursor-not-allowed'}`}
                                            >
                                                Acheter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Section Vente --- */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-red-400 flex items-center">
                            <DollarSign className="mr-2 w-5 h-5" /> 
                            Votre Inventaire (Vendre)
                        </h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {inventory.length === 0 ? (
                                <p className="text-gray-500">Votre inventaire est vide.</p>
                            ) : (
                                inventory.map((item, index) => (
                                    // Utiliser l'index pour la clé, car les IDs peuvent être dupliqués pour les consommables
                                    <div 
                                        key={index} 
                                        className="p-3 rounded-lg border border-gray-600 flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="font-bold text-white">{item.name}</div>
                                            <div className="text-xs text-gray-400">
                                                {item.type === 'consumable' ? `Effet: ${item.effect} (+${item.value})` : item.type}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-yellow-500 flex items-center justify-end">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                {/* Calcul de la valeur de vente arbitraire */}
                                                {Math.floor(25 * (item.value / 20))} 
                                            </div>
                                            <button
                                                onClick={() => handleSellItem(item)}
                                                className="mt-2 px-3 py-1 text-sm rounded transition bg-red-600 hover:bg-red-500"
                                            >
                                                Vendre
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MerchantUI;