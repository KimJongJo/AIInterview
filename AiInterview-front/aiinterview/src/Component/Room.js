import React from "react";
import "../Css/Room.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Room() {
  // 이력서를 텍스트로 변환한 text가 들어있음
  const { state } = useLocation();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [count, setCount] = useState(0);
  const [confirm, setConfirm] = useState(false);

  // 면접장 나가기 버튼
  const getOut = () => {
    if (window.confirm("정말 나가시겠습니까?")) {
      navigate("/");
    }
  };

  // 답변 버튼
  // 답변이 공백일 때 -> return
  // 답변들을 저장
  const answer = () => {
    if (currentAnswer.trim() === "") {
      alert("답변을 해주세요");
      return;
    }

    setAnswerList((prev) => [...prev, currentAnswer]);
    setCurrentAnswer("");

    // 다음 질문 번호로 넘기기
    setCount((prev) => prev + 1);
  };

  // 답변에 대한 리뷰
  const review = async () => {
    alert("답변 리뷰 api 생성");

    const response = await axios.post("http://localhost:8080/review", {
      questionList: questionList,
      answerList: answerList,
    });

    console.log(response.data.review);
  };

  // 질문, 답변 리스트들을 정리해서 표시

  // 최초 마운트 : 질문 리스트 세팅
  useEffect(() => {
    const questions = state.questions.split("\n");
    setQuestionList(questions);
    setComment(questions[count]); // 질문 설정
  }, []);

  // 질문에 대한 답변을 할 때 다음 질문으로 넘김
  useEffect(() => {
    if (count < questionList.length) {
      setComment(questionList[count]);
    } else {
      setComment("수고하셨습니다. 면접이 종료되었습니다.");
    }

    // 질문이 모두 끝났을 때 답변 리뷰 버튼 on
    if (count === 6) {
      setConfirm(true);
    }
  }, [count, questionList]);

  return (
    <div>
      <div className="reviewDiv">
        <div>
          <div className="head">질문</div>
          <div className="review">내용 내용 내용</div>
        </div>
        <div>
          <div className="head">답변</div>
          <div className="review">내용 내용 내용</div>
        </div>
        <div>
          <div className="head">리뷰</div>
          <div className="review">내용 내용 내용</div>
        </div>
      </div>

      <button type="button" onClick={getOut} className="getOutButton">
        나가기
      </button>
      <div className="RoomDiv">
        <div className="commentBox">{comment}</div>
        <img src="/images/면접관.png" className="RoomImg"></img>
        <div className="speakBox">
          <textarea
            style={{ display: confirm ? "none" : "block" }}
            placeholder="답변"
            className="textarea"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
          ></textarea>
          <button
            style={{ display: confirm ? "none" : "block" }}
            type="button"
            className="speakButton"
            onClick={answer}
          >
            말하기
          </button>
        </div>
      </div>
      <div className="reviewBtnDiv">
        <button
          type="button"
          className="reviewBtn"
          style={{ display: confirm ? "block" : "none" }}
          onClick={review}
        >
          답변 리뷰
        </button>
      </div>
    </div>
  );
}

export default Room;
