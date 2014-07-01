Benten
--------

お弁当注文システムです。

必要環境
---------

 * Linux
 * Node.js(v0.10.16で検証)
 * MongoDB

Usage
-------

```
git clone git@github.com:181dev/benten.git
cd benten
npm install
startMongo.sh &
npm start
```

API
------

メニュー取得

```
GET http://localhost:3000/menu.json  
```

オーダ検索（全件）
```
GET http://localhost:3000/api/orders
```

オーダ検索（特定日時）
```
GET http://localhost:3000/api/orders?date=日付（ミリ秒表現）
例）http://localhost:3000/api/orders?date=1402326000000
※日付は時分秒切り捨て
```

オーダ登録
```
POST http://localhost:3000/api/orders

パラメータ：
  menu: メニュー名称
  user: 氏名
  date: 日付の文字列表現（yyyy-MM-dd）
  price: 値段
```

オーダ削除
```
DELETE http://localhost:3000/api/orders/:_id

パラメータ：
  _id: オブジェクトID
```

貢献方法
--------

 * index.html内のJavascriptやHTMLテンプレートをいじる
 * Issueを立てる
 * Forkして書き直す
 * APIを利用した新UIを作る（現在のindex.htmlやadmin.htmlは仮組みです。）