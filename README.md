# 服薬管理アプリ

## 2025/07/15

### PMDAがシステムメンテナンスで叩けなかったのでUIだけ作った
<img width="959" height="947" alt="image" src="https://github.com/user-attachments/assets/22ade292-560f-44cd-9b56-80d2441e1256" />

## 2025/07/18
- React + Ant Design で服薬リマインダーの表示・編集画面を作成
  - Firestoreから曜日ごとの服薬時間データを取得して表示
  - 曜日選択ボタンで表示切替（「月〜日」＋「全部同じ」機能）
  - Ant DesignのTableとTimePickerを使い、時間を選択可能なUIを実装
  - 時間や有効/無効状態をstate管理し、Firestoreへの保存・読み込みに対応
  - 時間は24時間表示（HH:mm）で統一

- React 19とAnt Design v5の互換性問題を確認
  - React 19では`.ref`アクセスが廃止されているため警告が発生
  - 現状はReact 18での開発継続を推奨
