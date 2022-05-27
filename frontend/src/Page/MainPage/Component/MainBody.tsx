import React, { useState, useEffect, useContext, SyntheticEvent } from 'react';
import {
  clubItem,
  category,
  myClub,
  clubInfo,
  postInfo,
} from '../../../type/type';
import { Navigate, useNavigate } from 'react-router-dom';
import ClubItem from '../../../SharedComponent/ClubItem';
import '../Style/body.scss';
import sad from '../../../image/sad.svg';
import { store } from '../../../hooks/store';
import { getAPI } from '../../../hooks/useFetch';
import thumbnail from '../../../image/thumbnail.svg';

const categoryList: any = Object.freeze({
  '문화/예술/공연': 1,
  '봉사/사회활동': 2,
  '학술/교양': 3,
  '창업/취업': 4,
  어학: 5,
  체육: 6,
  친목: 7,
});

const MainBody = () => {
  const [page, setPage] = useState(0);
  const [pageEnd, setPageEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryState, setCategory] = useState<category[]>([]);
  const [curCategory, setCurCategory] = useState(0);
  const [clubList, setClubList] = useState<clubItem[]>([]);
  const categorizing = async (e: SyntheticEvent) => {
    const target = e.target as HTMLDivElement;
    const [status, res] = await getAPI(
      `/api/clubs?category=${categoryList[target.innerHTML]}`
    );
    setClubList([]);
    setClubList(res);
    setCurCategory(categoryList[target.innerHTML]);
  };

  const categorySetting = async () => {
    const [status, res]: any = await getAPI('/api/category');
    setCategory((categoryState) => [...categoryState, ...res]);
  };

  const [target, setTarget]: any = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [status, res] = await getAPI(`/api/clubs?page=${page}`);
    if (res.length < 5) setPageEnd(true);
    setClubList(res);
    setIsLoading(false);
  };

  const updateClubList = async () => {
    let api = '';
    if (curCategory === 0) api = `/api/clubs?page=${page}`;
    else api = `/api/clubs?category=${curCategory}`;
    const [status, res] = await getAPI(api);
    setClubList((clubList) => [...clubList, ...res]);
    if (res.length < 5) {
      setPageEnd(true);
    }
  };

  const callback = async ([entry]: any, observer: any) => {
    if (entry.isIntersecting && clubList.length > 3) {
      setPage((page) => page + 1);
      observer.disconnect();
      console.log('옵저버 콜백');
      setTimeout(() => observer.observe(target), 1000);
    }
  };

  useEffect(() => {
    fetchData();
    categorySetting();
  }, []);

  useEffect(() => {
    if (page > 0) {
      updateClubList();
    }
  }, [page]);

  useEffect(() => {
    let observer: any;
    if (target) {
      observer = new IntersectionObserver(callback, { threshold: 1.0 });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [curCategory, target]);

  return (
    <>
      <div className="MainBody-CategoryFrame">
        {categoryState?.map((val: any, idx: any) => {
          return (
            <>
              <div
                className={
                  categoryList[val.name] === curCategory
                    ? 'MainBody__div--category-frame-active'
                    : 'MainBody__div--category-frame'
                }
              >
                {' '}
                <div
                  key={idx}
                  className="MainBody__div--category-box"
                  onClick={categorizing}
                >
                  {val.name}
                </div>
              </div>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            </>
          );
        })}
        <div className="MainBody-mainInformation-title"></div>
      </div>
      <hr className="MainBody-horizon"></hr>
      <div className="MainBody">
        <div className="MainBody-itemFrame">
          {isLoading ? (
            <div className="MainBody-loading"></div>
          ) : clubList?.length === 0 ? (
            <div className="MainBody-noResult">
              <img src={sad} width="100px" height="100px"></img>동아리가
              존재하지 않아요!
            </div>
          ) : (
            <>
              {' '}
              {clubList?.map((val: any, idx: number) => {
                return <ClubItem key={idx} item={val}></ClubItem>;
              })}
              {pageEnd ? null : (
                <div ref={setTarget} className="Target-Element"></div>
              )}
            </>
          )}
        </div>
        <MainInformation></MainInformation>
      </div>
    </>
  );
};

const MainInformation = () => {
  const [joinedClub, setJoinedClub] = useState<myClub[]>([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    const [status, res] = await getAPI(`/api/users/joined-club`);

    if (status === 200) setJoinedClub(res);
    else console.log(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="MainInformation">
        <div className="MainInformation__text--myClub">나의 동아리</div>
        <div className="MainInformation__div--club-wrap">
          {joinedClub?.map((val: myClub, idx: number) => {
            return <MyClub clubInfo={val}></MyClub>;
          })}
        </div>
        <div className="MainInformation__text--myClub">최근 소식</div>
        <div className="MainInformation__div--club-wrap">
          {joinedClub?.map((val: myClub, idx: number) => {
            return <LatestPost clubInfo={val}></LatestPost>;
          })}
        </div>
      </div>
    </>
  );
};

const MyClub = ({ clubInfo }: { clubInfo: myClub }) => {
  const navigate = useNavigate();

  const moveTargetClub = (e: SyntheticEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLDivElement;
    navigate(`/information/${target.dataset.clubid}`);
  };

  return (
    <>
      <div className="MyClub__div" key={clubInfo.id}>
        <img
          className="MyClub__img--club-thumbnail"
          src={clubInfo.imageUrl ? clubInfo.imageUrl : thumbnail}
          width="50px"
          height="50px"
          data-clubid={clubInfo.id}
          onClick={moveTargetClub}
        ></img>
        <div className="MyClub__div--club-name">{clubInfo.name}</div>
      </div>
    </>
  );
};

const LatestPost = ({ clubInfo }: { clubInfo: myClub }) => {
  const [postList, setPostList] = useState<postInfo[]>([]);

  const fetchData = async () => {
    const [status, res] = await getAPI(`/api/post?clubId=${clubInfo.id}`);
    setPostList(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {clubInfo?.name}
      {postList[0]?.content}
    </>
  );
};

export default MainBody;
