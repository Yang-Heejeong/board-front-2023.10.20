import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import Search from 'views/Search';
import BoardDetail from 'views/Board/Detail';
import BoardUpdate from 'views/Board/Update';
import BoardWrite from 'views/Board/Write';
import User from 'views/User';
import Container from 'layouts/Container';
import { useEffect } from 'react';
import { useUserStore } from 'stores';
import { useCookies } from 'react-cookie';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/dto/response/user';
import ResponseDto from 'apis/dto/response';

  // 보통 const response = await axios.get("http://localhost:4000"); 가 실행된 후 console.log(response.data); 가 실행된다.
  // 하지만 아래와 같은 경우에는 호출을 하지만 결과를 기다리지 않고 바로 다음 줄이 실행되는 비동기함수 현상이 발생하기 때문에
  // axios 앞에 await를 걸어 결과가 나올 수 있도록 기다리게 해준다.
  // 이후에 async를 사용함으로써 비동기함수를 동기함수로 변경해준다.

  // const serverCheck = async() => {
  //   const response = await axios.get("http://localhost:4000");
  //   console.log(response.data);
  //    함수를 반환하면 then에 매개 변수를 받을 수 있다.
  //   return response.data;
  // }

  // 아래는 비동기로 처리가 되기 때문에 response 처리를 기다리지 않고 바로 내보낸다.
  // 그래서 response 보다 useEffect 콘솔이 먼저 찍히게 된다.
  // useEffect(() => {
    // "Server on"이 두 번 뜨는 이유는 useEffect가 두 번 돌기 때문에 생기는 현상이다.
    // useEffect에는 async사용할수 없기 때문에 then을 사용하여 작업이 끝나면 작업이 사작할 수 있게 한다.
    // then() : 실행시켜라. 이기 때문에 함수가 들어와야 한다.
    // data = serverCheck의 결과물!
    // serverCheck().then((data) => {
    //   console.log(data);
    //   console.log('뒤에오는 콘솔');
    // });
    // 동기 함수가 실행되는 동안 예외 처리를 해줘야 한다.
    // serverCheck() // 서버체크
    //   .then((data) => console.log(data))
    //   catch로 에러를 받는 함수 작성
    //   .catch((error) => {
    //     console.log(error.response.data);
    //   });
  // }, []);

function App() {

  //          state: 현재 페이지 url 상태          //
  const { pathname } = useLocation();
  //          state: 로그인 유저 상태          //
  const { user, setUser } = useUserStore();
  //          state: cookie 상태          //
  const [cookies, setCookie] = useCookies();

  //          function: get sign in user response 처리 함수 //
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto) => {
    const { code } = responseBody;
    if (code !== 'SU') {
      setCookie('accessToken', '', { expires: new Date(), path: MAIN_PATH });
      setUser(null);
      return;
    }

    setUser({ ...responseBody as GetSignInUserResponseDto });
        
  }

  //          effect: 현재 path가 변경될 때마다 실행될 함수          //
  useEffect(() => {

    const accessToken = cookies.accessToken;
    if (!accessToken) {
      setUser(null);
      return;
    }

    getSignInUserRequest(accessToken).then(getSignInUserResponse);
      
  }, [pathname]);

  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH} element={<Main />} />
        <Route path={AUTH_PATH} element={<Authentication />} />
        <Route path={SEARCH_PATH(':word')} element={<Search />} />
        <Route path={BOARD_WRITE_PATH} element={<BoardWrite />} />
        <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
        <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
        <Route path={USER_PATH(':searchEmail')} element={<User />} />
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
  
  // ! 네비게이션 설계
  // ! 메인 화면 : '/' - Main
  // ! 로그인 화면 + 회원가입 화면 : /auth - Authentication
  // ! 검색 화면 : '/search/:word' - Search
  // ! 게시물 상세 보기 화면 : '/board/detail/:boardNumber' - BoardDetail
  // ! 게시물 작성 화면 : '/board/write' - BoardWrite
  // ! 게시물 수정 화면 : '/board/update/:boardNumber' - BoardUpdate
  // ! 유저 게시물 화면 : '/user/:email' - User