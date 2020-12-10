import { Config, CognitoIdentityCredentials } from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';

// Component
class App extends Component {
  render() {
    return (
      <div>
        <Hello />
        <Form />
      </div>
    );
  }
}

// Stateless Functional Component
const Hello = () => {
  const [message, setMessage] = useState('Hello');

  const hello = async () => {
    setMessage(message + 'o');
  };
  return (
    <div>
      <div>Hello React!!!</div>
      <div>{message}</div>
      <button onClick={hello}>Hello!</button>
    </div>
  );
};

const Form = () => {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [code, setCode] = useState('');

  const [message, setMessage] = useState('');

  // 　1　Amazon Cognito 認証情報プロバイダーを初期化します
  Config.region = 'ap-northeast-1'; // リージョン(デフォルトだとこのまま)
  Config.credentials = new CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:87771f29-284d-43b2-96a3-8265e67de981', // ID プールのID
  });
  // 　2　Amazon Cognito Userpoolの指定＋クライアントアプリの指定
  const poolData = {
    UserPoolId: 'ap-northeast-1_CmjLkfk0t', //ユーザープールのID
    ClientId: '62ss6coqb381bg9qajetbccnqe', //クライアントアプリの設定上のID
  };
  //ユーザープール＋クライアントアプリの情報を格納
  const userPool = new CognitoUserPool(poolData);

  const signUp = (e) => {
    console.log('signUp()');

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: name,
      }),
    ];

    userPool.signUp(name, pass, attributeList, null, function (err, result) {
      if (err) {
        console.log(err);
        setMessage(err.message);
      } else {
        const cognitoUser = result.user;
        console.log(result);
        console.log('user name is ' + cognitoUser.getUsername());
        setMessage(cognitoUser.getUsername() + 'が作成されました');
      }
    });
  };

  const login = (e) => {
    console.log('login()');
    e.preventDefault();
    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: pass,
    });

    const userData = {
      Username: name,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (authresult) {
        console.log('Well done!');
        console.log(authresult);
      },
      onFailure: function (err) {
        console.log(err.message);
      },
    });
  };

  const verifyCode = () => {
    console.log('verifyCode()');

    const userData = {
      Username: name,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    // アクティベーション処理
    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        // アクティベーション失敗の場合、エラーメッセージを画面に表示
        if (err.message != null) {
          console.log(err.message);
        }
      } else {
        // アクティベーション成功の場合、サインイン画面に遷移
        console.log(result);
      }
    });
  };
  return (
    <div>
      <form onSubmit={login}>
        <div>
          <label htmlFor="name">ユーザー名：</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pass">パスワード：</label>
          <input
            id="pass"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name">コード：</label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="button" onClick={signUp}>
          登録
        </button>
        <button type="submit">ログイン</button>
        <button type="button" onClick={verifyCode}>
          コード確認
        </button>
      </form>
      {message}
    </div>
  );
};

// initialize
ReactDOM.render(<App />, document.getElementById('app'));
