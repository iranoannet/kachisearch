'use client';

import { useState, useEffect } from 'react';
import type { CardInfo } from '@/lib/shops';

interface AlertSetting {
  cardId: string;
  targetPrice: number;
  isAbove: boolean;
  isActive: boolean;
}

interface PriceAlertProps {
  card: CardInfo;
}

export default function PriceAlert({ card }: PriceAlertProps) {
  const [alertSetting, setAlertSetting] = useState<AlertSetting | null>(null);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [isAbove, setIsAbove] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    // ローカルストレージからアラート設定を読み込む
    const savedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    const savedAlert = savedAlerts[card.id];
    
    if (savedAlert) {
      setAlertSetting(savedAlert);
      setTargetPrice(savedAlert.targetPrice);
      setIsAbove(savedAlert.isAbove);
      setIsActive(savedAlert.isActive);
    }
  }, [card.id]);

  const handleSaveAlert = () => {
    const newAlert: AlertSetting = {
      cardId: card.id,
      targetPrice,
      isAbove,
      isActive: true
    };

    // ローカルストレージに保存
    const savedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    savedAlerts[card.id] = newAlert;
    localStorage.setItem('priceAlerts', JSON.stringify(savedAlerts));

    setAlertSetting(newAlert);
    setIsActive(true);
  };

  const handleDeleteAlert = () => {
    // ローカルストレージから削除
    const savedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '{}');
    delete savedAlerts[card.id];
    localStorage.setItem('priceAlerts', JSON.stringify(savedAlerts));

    setAlertSetting(null);
    setIsActive(false);
  };

  // アラート条件をチェック
  useEffect(() => {
    if (!alertSetting || !alertSetting.isActive) return;

    const currentPrice = Math.min(...card.prices.map(p => p.price));
    const shouldAlert = alertSetting.isAbove
      ? currentPrice >= alertSetting.targetPrice
      : currentPrice <= alertSetting.targetPrice;

    if (shouldAlert) {
      // ブラウザ通知を表示
      if (Notification.permission === 'granted') {
        new Notification('価格アラート', {
          body: `${card.name}の価格が${alertSetting.targetPrice.toLocaleString()}円を${alertSetting.isAbove ? '上回りました' : '下回りました'}。`,
          icon: card.imageUrl
        });
      }
    }
  }, [card.prices, alertSetting]);

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-4">価格アラート設定</h4>
      
      {!alertSetting ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isAbove}
                onChange={() => setIsAbove(true)}
                className="form-radio"
              />
              <span>価格が上回った時</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!isAbove}
                onChange={() => setIsAbove(false)}
                className="form-radio"
              />
              <span>価格が下回った時</span>
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={targetPrice || ''}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              placeholder="目標価格"
              className="border rounded px-2 py-1 w-32"
            />
            <span>円</span>
          </div>
          
          <button
            onClick={handleSaveAlert}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            アラートを設定
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            現在の設定: 価格が
            <span className="font-bold">
              {alertSetting.targetPrice.toLocaleString()}円
            </span>
            を{alertSetting.isAbove ? '上回った時' : '下回った時'}に通知
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteAlert}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              アラートを解除
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 