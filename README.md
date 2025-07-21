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

### 2025/07/21
- 「毎日同じです」ボタンを実装し、押すと全曜日の時間設定に反映されるようにした
- 保存ボタン押下時に、少なくとも1つ食前・食後の時間が選択されていなければアラートを表示する機能を追加した
- 保存ボタンを押すと別ページ（SavedPage）に遷移して設定内容を表示する機能を実装した
- SavedPageで渡された状態（times・checked）を受け取り、曜日ごとにリマインダー内容を表示するUIを作成した
- 保存データをlocalStorageに保存し、リロードやページ遷移しても状態が消えないように状態管理を強化した
- ReminderFormWithPromptコンポーネントでマウント時にlocalStorageの保存データを読み込み、復元する処理を追加した
- SavedPageの「戻る」ボタンからフォームページに戻っても、localStorageのデータを使い状態が維持される動作を実現した
<img width="955" height="908" alt="image" src="https://github.com/user-attachments/assets/1929eb60-0709-4824-80ae-f560af443c85" />
