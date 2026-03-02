"use strict";

//画像とリンクした数字配列
const numbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13,
];
//トランプの画像
const cards_img = [
  "images/club/1.png",
  "images/club/2.png",
  "images/club/3.png",
  "images/club/4.png",
  "images/club/5.png",
  "images/club/6.png",
  "images/club/7.png",
  "images/club/8.png",
  "images/club/9.png",
  "images/club/10.png",
  "images/club/11.png",
  "images/club/12.png",
  "images/club/13.png",
  "images/diamond/1.png",
  "images/diamond/2.png",
  "images/diamond/3.png",
  "images/diamond/4.png",
  "images/diamond/5.png",
  "images/diamond/6.png",
  "images/diamond/7.png",
  "images/diamond/8.png",
  "images/diamond/9.png",
  "images/diamond/10.png",
  "images/diamond/11.png",
  "images/diamond/12.png",
  "images/diamond/13.png",
  "images/heart/1.png",
  "images/heart/2.png",
  "images/heart/3.png",
  "images/heart/4.png",
  "images/heart/5.png",
  "images/heart/6.png",
  "images/heart/7.png",
  "images/heart/8.png",
  "images/heart/9.png",
  "images/heart/10.png",
  "images/heart/11.png",
  "images/heart/12.png",
  "images/heart/13.png",
  "images/spade/1.png",
  "images/spade/2.png",
  "images/spade/3.png",
  "images/spade/4.png",
  "images/spade/5.png",
  "images/spade/6.png",
  "images/spade/7.png",
  "images/spade/8.png",
  "images/spade/9.png",
  "images/spade/10.png",
  "images/spade/11.png",
  "images/spade/12.png",
  "images/spade/13.png",
];

//ゲームモードの変数
let gameMode = "main";
//神経衰弱１０秒タイマー
let gameTimer = null;
//ミニゲーム５秒タイマー
let subGameTimer = null;

//メイン画面を取得
const mainGame = document.querySelector(".mainGame");
mainGame.style.visibility = "visible";

//カード枚数
const cardNumbers = cards_img.length;
//全カードを代入する変数
let cards = null;

//ボタン
const start = document.querySelector("button");
//タイトル
const title = document.querySelector("h1");
//残り枚数
const score = document.querySelector("h2");
let score_text = document.querySelector(".score");

//カード操作可能
let play = true;
// カード１枚目
let firstCard = null;
let firstNumber = null;
// カード２枚目
let secondCard = null;
let secondNumber = null;
// 残りペア数
let count = 26;

//ゲーム開始時間
let startTime = null;
//ゲーム終了時間
let finishTime = null;
//10秒カウントダウン
let countDown = 10;
let countdownTimer = null;

//10秒カウントダウン
function countdown() {
  //カウント情報を初期化
  clearTimeout(countdownTimer);
  //10をカウントダウンのセレクタに代入
  document.querySelector(".countdown").textContent = countDown;

  //カウントダウンが0になるまで1減らす
  if (countDown > 0) {
    countDown--;
    //1秒経ったらカウントダウンを進める
    countdownTimer = setTimeout(countdown, 1000);
  }
}

//最初はスコアを隠す
score.style.visibility = "hidden";

//スタートボタン押したら
start.addEventListener("click", () => {
  //10秒カウントダウン開始
  countdown();
  //ゲーム開始時間を取得
  startTime = new Date();
  //スタートボタン隠してスコアを表示
  start.style.visibility = "hidden";
  score.style.visibility = "visible";
  //タイトル移動のクラスを付加
  title.classList.add("title");
  //カード生成
  cardsCreate();
  showCard();
  timer();
});

//最初に呼び出されるタイマー（10秒）
function timer() {
  //神経衰弱タイマーを初期化
  clearTimeout(gameTimer);

  //10秒経過後サブゲームに遷移
  gameTimer = setTimeout(() => {
    if (gameMode === "main") {
      changeSubGame();
    }
  }, 10000);
}

//メイン→サブ
function changeSubGame() {
  //ゲームモードをサブに変更
  gameMode = "sub";
  //カード操作不可
  // play = false;
  //メインを隠してサブを表示
  mainGame.style.display = "none";
  subGame.style.display = "block";
  //サブ呼び出し
  startSubGame();
}

//サブ→メイン
function changeMainGame() {
  //ゲームモードをメインに変更
  gameMode = "main";
  //カード操作可
  play = true;
  //サブを隠す
  subGame.style.display = "none";
  //サブ→メインのインターバル（0.1秒）
  setTimeout(() => {
    //サブを停止
    stopSubGame();
    //10秒カウントダウン開始
    countDown = 10;
    countdown();
    timer();
    //メインの表示
    mainGame.style.display = "block";
  }, 1000);
}

//カード生成
function cardsCreate() {
  //ゲームの盤面を取得
  const game = document.querySelector(".game");
  //カードの枚数分divを生成
  for (let i = 0; i < cardNumbers; i++) {
    const card = document.createElement("div");
    //生成したdivにcardクラスを付加
    card.classList.add("card");
    //生成したcardをゲーム盤面gameの子要素に追加
    game.appendChild(card);
  }
  //すべてのカードを取得
  cards = document.querySelectorAll(".card");
  //カードの中身をシャッフル
  shuffle();
}

//シャッフル
function shuffle() {
  for (let i = cardNumbers - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    //画像リンク配列と対応数字配列を一緒に中身変更
    [cards_img[i], cards_img[j]] = [cards_img[j], cards_img[i]];
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
}

//カードめくる
function showCard() {
  cards.forEach((card, i) => {
    card.addEventListener("click", function () {
      if (play) {
        // 同じカードの2回クリック防止
        if (firstCard === this) return;

        //カードをめくったあとに変更
        this.style.backgroundImage = `url(${cards_img[i]})`;
        //カード一枚目がnullの時
        if (!firstCard) {
          //カードのオブジェクトと数字を代入
          firstCard = this;
          firstNumber = numbers[i];
        } else {
          secondCard = this;
          secondNumber = numbers[i];

          //カードをめくれないようにする
          play = false;
          // 数字が揃ったかどうかをチェックする
          matchCards(firstCard, secondCard, firstNumber, secondNumber);
        }
      }
    });
  });
}

//ペア判定
function matchCards(firstCard, secondCard, firstNumber, secondNumber) {
  //ペアが揃ったとき
  if (firstNumber == secondNumber) {
    //0.8秒後
    setTimeout(() => {
      //揃ったカードを隠す
      firstCard.style.visibility = "hidden";
      secondCard.style.visibility = "hidden";
      //残りペア数を減らす
      count--;
      //スコアに反映
      score_text.textContent = count;
      //ゲーム状態と一枚目、二枚目の変数を初期化
      reset();

      //すべてめくったとき
      if (count == 0) {
        //0.3秒後にゲームクリアの表示
        setTimeout(() => {
          gameClear();
        }, 300);
      }
    }, 800);
    //揃わなかったとき
  } else {
    //0.6秒後にカードを裏面に戻す
    setTimeout(() => {
      firstCard.style.backgroundImage = `url("images/back/teal.png")`;
      secondCard.style.backgroundImage = `url("images/back/teal.png")`;
      reset();
    }, 600);
  }
}

//ゲーム状態と一枚目、二枚目の変数を初期化
function reset() {
  play = true;
  firstCard = null;
  secondCard = null;
  firstNumber = null;
  secondNumber = null;
}

//ゲームクリア
function gameClear() {
  //終了時のタイムを取得
  finishTime = new Date();
  //クリアタイム計算
  let clearTime = String(Math.floor((finishTime - startTime) / 1000));
  //1分以上の表示
  if (clearTime > 60) {
    const min = Math.floor(clearTime / 60);
    const sec = Math.floor(clearTime % 60);
    //ゲームクリアメッセージをアラートで表示
    window.alert(
      "ゲームクリアおめでとう！クリア時間は" +
        min +
        "分" +
        sec +
        "秒！ちなみにミニゲームの総得点は" +
        subScore +
        "点！！",
    );
  } else {
    //ゲームクリアメッセージをアラートで表示
    window.alert(
      "ゲームクリアおめでとう！クリア時間は" +
        clearTime +
        "秒！ちなみにミニゲームの総得点は" +
        subScore +
        "点！！",
    );
  }

  //スタートボタン、スコア、タイトルを最初の状態に戻す
  gameReset();
}

/*数字ミニゲーム--------------------------------------------------------------*/

//画像とリンクした数字配列
const numList = [1, 2, 3, 4, 5];
//画像配列
const numImg = [
  "images/number/1.png",
  "images/number/2.png",
  "images/number/3.png",
  "images/number/4.png",
  "images/number/5.png",
];

//サブゲーム全体
const subGame = document.querySelector(".subGame");
//数字表示エリア
const numArea = document.querySelector(".numArea");
//隠した状態で開始
subGame.style.display = "none";
//消した数字のカウント
let numCount = 10;

//サブゲームスコアを取得
const scoreEl = document.querySelector(".subScore");
//0で初期化
let subScore = 0;

//サブ開始
function startSubGame() {
  //サブゲームのスコアを表示
  scoreEl.textContent = subScore;

  // 数字を10個生成
  for (let i = 0; i < 10; i++) {
    numCount = 10;
    createNumber();
  }
  //サブゲームタイマー（8.5秒）
  subGameTimer = setTimeout(() => {
    //数字を全部消せてたら続行
    if (numCount === 0) {
      //メインへ戻る
      changeMainGame();
    } else {
      //数字を消せてなかったらゲームオーバー
      gameOver();
      // changeMainGame();
    }
  }, 8500);
}

//サブ停止
function stopSubGame() {
  //サブタイマーを停止、リセット
  clearTimeout(subGameTimer);
  subGameTimer = null;

  //残ってる数字を削除
  numArea.innerHTML = "";
}
//数字を1個表示
function createNumber() {
  //1-5のどの数字を表示するかを決める
  const index = Math.floor(Math.random() * numList.length);
  //imgタグを作成
  const img = document.createElement("img");
  //選ばれた画像のパスをセット
  img.src = numImg[index];
  //cssを付加
  img.classList.add("num");

  //画像読み込んだ時
  img.onload = () => {
    //画像のサイズを取得
    const w = img.offsetWidth;
    const h = img.offsetHeight;

    //はみ出ない場所の中から表示座標をランダムで決定
    const x = Math.random() * (numArea.clientWidth - w);
    const y = Math.random() * (numArea.clientHeight - h);

    //決定した座標を反映
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
  };

  //画像を表示
  numArea.appendChild(img);

  //画像をクリックしたとき
  img.addEventListener("click", () => {
    //クリックした数字分スコアを加算
    subScore += numList[index];
    //加算されたスコアを表示
    scoreEl.textContent = subScore;
    //クリックされた数字を消す
    img.remove();
    //残りの表示されている数字カウントを減らす
    numCount--;
  });
}

//ゲームオーバー
function gameOver() {
  alert("ゲームオーバー！！");

  gameReset();
}

function gameReset() {
  // タイマー停止
  clearTimeout(gameTimer);
  clearTimeout(subGameTimer);
  clearTimeout(countdownTimer);

  // ゲームモード初期化
  gameMode = "main";

  // 画面をサブからメインに戻す
  subGame.style.display = "none";
  mainGame.style.display = "block";

  // カウントダウン初期化
  countDown = 10;
  document.querySelector(".countdown").textContent = countDown;

  // タイトル画面に戻す
  start.style.visibility = "visible";
  score.style.visibility = "hidden";
  title.classList.remove("title");

  // ミニゲーム初期化
  numArea.innerHTML = "";
  numCount = 10;
  subScore = 0;

  //神経衰弱初期化
  document.querySelector(".game").innerHTML = "";
  count = 26;
  score_text.textContent = count;
}
