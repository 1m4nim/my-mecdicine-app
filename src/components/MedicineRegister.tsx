import React, { useState, useEffect, useRef } from 'react'
import ReminderForm from './ReminderForm'

type SavedData = {
  id: string
  times: Record<string, string>
  selectedDays: string[]
}

const MedicineRegister = () => {
  const [showOptions, setShowOptions] = useState(false)
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [savedData, setSavedData] = useState<SavedData | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showOptions &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOptions])

  const handleSaveSuccess = (data: SavedData) => {
    setSaveMessage(`リマインダーを保存しました！`)
    setSavedData(data)
    setShowReminderForm(false)
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1rem 0',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'black',
      }}
    >
      <h1 style={{ marginTop: 0 }}>薬登録アプリ</h1>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => {
            setShowOptions(!showOptions)
            setSaveMessage(null)
          }}
          style={{
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            background: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          服薬に関するメニューを開く
        </button>

        {showOptions && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              padding: '0.5rem',
              borderRadius: '4px',
              zIndex: 100,
              width: '250px',
              textAlign: 'left',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <button
                style={{
                  width: '100%',
                  backgroundColor: 'gray',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.5rem 0',
                }}
              >
                薬を登録する(今は使えません)
              </button>
              <p style={{ fontSize: '0.8rem', color: 'blue' }}>
                ※ PMDAから取得した薬の一覧が表示され、<strong>複数の薬を選んで</strong>登録できる（予定）
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <button
                style={{
                  width: '100%',
                  backgroundColor: 'gray',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.5rem 0',
                }}
              >
                登録済みの薬を見る(今は使えません)
              </button>
              <p style={{ fontSize: '0.8rem', color: 'blue' }}>
                ※ 登録した薬の一覧が表示される（予定）
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <button
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  cursor: 'pointer',
                  borderRadius: 4,
                  color: 'white',
                }}
                onClick={() => {
                  setShowReminderForm(true)
                  setShowOptions(false)
                  setSaveMessage(null)
                }}
              >
                服薬リマインダーを設定する
              </button>
              <p style={{ fontSize: '0.8rem', color: 'blue' }}>
                ※ 選んだ薬の服用時間を設定できるようになる
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowOptions(false)}
                style={{
                  padding: '0.3rem 1rem',
                  backgroundColor: 'blue',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>

      {saveMessage && (
        <p
          style={{
            marginTop: '1rem',
            padding: '0.8rem 1rem',
            backgroundColor: '#e6ffed',
            border: '1px solid #85d48b',
            borderRadius: '4px',
            color: '#2e7d32',
            fontWeight: 'bold',
            width: '540px',
            textAlign: 'center',
          }}
        >
          {saveMessage}
        </p>
      )}

      {savedData && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: '1px solid #85d48b',
            borderRadius: '4px',
            backgroundColor: '#e6ffed',
            width: '540px',
            textAlign: 'left',
            color: '#2e7d32',
            fontWeight: 'bold',
            whiteSpace: 'pre-line',
          }}
        >
          <div>【保存済みリマインダー内容】</div>
          <div>
            時間設定:
            {Object.entries(savedData.times)
              .map(([label, time]) => `\n・${label}: ${time || '未設定'}`)
              .join('')}
          </div>
          <div>曜日: {savedData.selectedDays.join('、')}</div>
        </div>
      )}

      {showReminderForm && (
        <ReminderForm
          onClose={() => setShowReminderForm(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  )
}

export default MedicineRegister
