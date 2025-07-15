import React, { useState, useEffect, useRef } from 'react'

const MedicineRegister = () => {
    const [showOptions, setShowOptions] = useState(false)
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

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '1rem 0',
                fontFamily: 'sans-serif',
                backgroundColor: 'white',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                color: 'black',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ marginTop: 0 }}>薬登録アプリ</h1>

                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}
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
                                <button style={{ width: '100%' }}>薬を登録する</button>
                                <p style={{ fontSize: '0.8rem', color: 'blue' }}>
                                    ※ PMDAから取得した薬の一覧が表示され、<strong>複数の薬を選んで</strong>登録できる（予定）
                                </p>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <button style={{ width: '100%' }}>登録済みの薬を見る</button>
                                <p style={{ fontSize: '0.8rem', color: 'blue' }}>
                                    ※ 登録した薬の一覧が表示される（予定）
                                </p>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <button style={{ width: '100%' }}>服薬リマインダーを設定する</button>
                                <p style={{ fontSize: '0.8rem', color: 'blue' }}>
                                    ※ 選んだ薬の服用時間を設定できるようになる（予定）
                                </p>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => setShowOptions(false)}
                                    style={{
                                        padding: '0.3rem 1rem',
                                        backgroundColor: '#ccc',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MedicineRegister
