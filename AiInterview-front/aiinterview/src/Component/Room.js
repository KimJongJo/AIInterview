import React from "react";
import "../Css/Room.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Room() {
  // 이력서를 텍스트로 변환한 text가 들어있음
  const { state } = useLocation();
  const [coment, setComent] = useState(
    "이력서 읽는중... (잠시만 기다려주세요)"
  );
  const navigate = useNavigate();

  const getOut = () => {
    if (window.confirm("정말 나가시겠습니까?")) {
      navigate("/");
    }
  };

  useEffect(() => {
    console.log(state?.questions);
  }, []);

  return (
    <div>
      <button type="button" onClick={getOut} className="getOutButton">
        나가기
      </button>
      <div className="RoomDiv">
        <div className="comentBox">{coment}</div>
        <img src="/images/면접관.png" className="RoomImg"></img>
        <div className="speakBox">
          <textarea placeholder="답변" className="textarea"></textarea>
          <button type="button" className="speakButton">
            말하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Room;
