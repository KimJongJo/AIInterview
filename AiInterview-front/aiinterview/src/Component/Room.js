import React, { use } from "react";
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
  const [reviewList, setReviewList] = useState([]);

  // api 중복 요청 방지
  const [clickCheck, setClickCheck] = useState(false);

  // 최종 결과 div
  const [end, setEnd] = useState(false);

  // 답변 생성중 div
  const [time, setTime] = useState(false);

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
    if (clickCheck) {
      alert("답변 리뷰 중입니다. 잠시만 기다려주세요");
      return;
    }

    setClickCheck(true);
    alert("10초 정도 소요됩니다.");

    setTime(true);

    const response = await axios.post("http://localhost:8080/review", {
      questionList: questionList,
      answerList: answerList,
    });

    // console.log(response.data.review);
    const reviews = response.data.review.split("\n");

    setTime(false);
    setReviewList(reviews);
    setEnd(true);
    console.log("답변 생성 완료");
  };

  // 질문, 답변 리스트들을 정리해서 표시
  function cleanDocument(list) {
    return list.map((document, index) => {
      return (
        <div key={index} className="document">
          {document}
        </div>
      );
    });
  }

  // 최초 마운트 : 질문 리스트 세팅
  useEffect(() => {
    const questions = state.questions.split("\n").filter((item) => item !== "");

    setQuestionList(questions);
    setComment(questions[count]); // 질문 설정
  }, []);

  // 질문에 대한 답변을 할 때 다음 질문으로 넘김
  useEffect(() => {
    if (count < questionList.length) {
      setComment(questionList[count]);
    } else {
      setComment(
        "수고하셨습니다. 면접이 종료되었습니다. 아래에 답변 리뷰를 클릭 해 주세요"
      );
    }

    // 질문이 모두 끝났을 때 답변 리뷰 버튼 on
    if (count === 6) {
      setConfirm(true);
    }
  }, [count, questionList]);

  return (
    <div>
      <div className="getOutDiv">
        <button type="button" onClick={getOut} className="getOutButton">
          나가기
        </button>
      </div>

      <div className="reviewDiv" style={{ display: end ? "flex" : "none" }}>
        <div className="reviewInDiv">
          <div className="head">질문</div>
          <div className="review">{cleanDocument(questionList)}</div>
        </div>
        <div className="reviewInDiv">
          <div className="head">답변</div>
          <div className="review">{cleanDocument(answerList)}</div>
        </div>
        <div className="reviewInDiv">
          <div className="head">AI 리뷰</div>
          <div className="review">{cleanDocument(reviewList)}</div>
        </div>
      </div>

      <div style={{ display: end || time ? "none" : "block" }}>
        {/* <div style={{ display: "none" }}> */}
        <div className="RoomDiv">
          <div className="commentBox">{comment}</div>
          <img src="/images/면접관.png" className="RoomImg"></img>
          <div
            className="speakBox"
            style={{ display: confirm ? "none" : "flex" }}
          >
            <textarea
              placeholder="답변"
              className="textarea"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            ></textarea>
            <button type="button" className="speakButton" onClick={answer}>
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

      <div style={{ display: time ? "block" : "none" }}>
        <div className="ing">답변에 대한 피드백 생성중 ... </div>
        <img className="ingImg" src="/images/회의.jpg"></img>
        <div className="ing">잠시만 기다려주세요</div>
      </div>
    </div>
  );
}

export default Room;
