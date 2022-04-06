import React, { EventHandler, KeyboardEventHandler } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Style/shared.scss';
import person from '../image/person.svg';
import ClubCreateModal from './ClubCreateModal';

const MainHeader = () => {
  const [inputState, setInputState] = useState('');
  const [modalState, setModalState] = useState(false);
  const navigate = useNavigate();
  const locations = useLocation();

  const setInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputState(event.target.value);
  };

  const modalOnOff = () => {
    if (modalState) setModalState(false);
    else setModalState(true);
  };

  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/result`);
    }
  };

  return (
    <>
      <div className="MainHeader">
        <div
          className="MainHeader-university"
          onClick={() => {
            navigate('/home');
          }}
        >
          대학교명(API)
        </div>
        <input
          className="MainHeader-searchBar"
          type="search"
          placeholder="동아리를 검색하세요"
          onChange={setInput}
          onKeyPress={enter}
        ></input>
        <img
          className="MainHeader-myPage"
          src={person}
          width="50px"
          height="50px"
          onClick={() => {
            navigate('/mypage');
          }}
        ></img>
        <div className="MainHeader__button--club-create" onClick={modalOnOff}>
          동아리 생성
        </div>
        <ClubCreateModal
          modalState={modalState}
          setModal={modalOnOff}
        ></ClubCreateModal>
      </div>
    </>
  );
};

export default MainHeader;
