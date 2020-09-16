import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import DogImgList from "../../components/DogImgList/DogImgList";
import Loading from "../../components/Loading/Loading";

const InfiniteScroll = () => {
  const [data, setData] = useState([]); // 강아지 전체 이미지 데이터
  const [imgList, setImgList] = useState([]); // 화면에 보여질 강아지 이미지 데이터
  const [dogCategory, setDogCategory] = useState(""); // 검색 할 강아지 종류
  const [loading, setLoading] = useState(false); // 화면 로딩 여부
  const [errorMessage, setErrorMessage] = useState(false);

  // 강아지 이미지 데이터 검색
  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage(false);
    await axios
      .get(`https://dog.ceo/api/breed/${dogCategory}/images`)
      .then((res) => {
        setData(res.data.message);
        setImgList(res.data.message.slice(0, 40));
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.log("error", error);
        setErrorMessage(true);
        setLoading(false);
      });
  };

  // 엔터 입력 함수
  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      handleSearch();
    }
  };

  // 무한 스크롤 이벤트
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (scrollHeight - scrollHeight / 3.5 - scrollTop < clientHeight) {
      setImgList(data.slice(0, imgList.length + 10));
    }
  };

  useEffect(() => {}, [dogCategory, imgList, loading]);

  console.log("data", data);
  console.log("imgList", imgList);
  return (
    <ScrollPage onScroll={handleScroll}>
      <Header>
        <SearchBox>
          <SearchInput
            value={dogCategory}
            type="text"
            placeholder="입력해주세요."
            onChange={(e) => setDogCategory(e.target.value)}
            onKeyPress={handleKeyPress}
          ></SearchInput>
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBox>
      </Header>
      {loading ? <Loading /> : null}
      {errorMessage ? (
        <ErrorMessageText>에러가 발생했습니다.</ErrorMessageText>
      ) : (
        <DogImgList loading={`${loading}`} Imgdata={imgList} />
      )}
    </ScrollPage>
  );
};

export default InfiniteScroll;

const ScrollPage = styled.main`
  width: 100%;
  height: 100vh;
  overflow: auto;
`;

const Header = styled.header`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchBox = styled.div`
  width: 20%;
  display: flex;
  background-color: #c4c4c4;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  width: 80%;
  padding: 0.5em;
`;

const SearchButton = styled.button`
  width: 20%;
  background-color: #000;
  color: white;
  font-weight: bold;
  padding: 0 1em;

  :hover {
    cursor: pointer;
  }
`;

const ErrorMessageText = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
`;