import "../Css/Main.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Main() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const [isWating, setIswating] = useState(false);

  const interviewInfo = async () => {
    if (isWating) {
      alert("현재 면접장으로 들어가는중입니다...");
      return;
    }

    if (userInfo === null) {
      alert("이력서를 선택해주세요.");
      return;
    } else {
      if (window.confirm("면접을 보시겠습니까?")) {
        alert("면접을 시작합니다.");

        // 대기상태로 변경
        setIswating(true);

        const formDate = new FormData();
        formDate.append("file", userInfo);

        try {
          const response = await axios.post(
            "http://localhost:8080/upload",
            formDate
          );

          if (response === null) {
            alert("서버 응답 실패");
            return;
          }

          // 서버에 이력서를 전달한 뒤 gpt를 통한 질문을 응답 받음
          navigate("/Room", { state: { questions: response.data.questions } });
        } catch (error) {
          console.error("서버 응답 실패 : " + error);
        }
      }
    }
  };

  return (
    <div>
      <div className="watingDiv">
        <div
          style={{ display: isWating ? "block" : "none" }}
          className="watingBox"
        >
          들어가는중 입니다... 잠시만 기다려주세요...
        </div>
      </div>
      <img src="/images/문.jpg" width={"700px"}></img>
      <div>
        <span className="MainSpan">이력서 선택 : </span>
        <input
          type="file"
          className="MainInput"
          onChange={(e) => setUserInfo(e.target.files[0])}
        ></input>
      </div>
      <button className="MainButton" type="button" onClick={interviewInfo}>
        면접보기
      </button>
    </div>
  );
}

export default Main;
