import React, {
  SyntheticEvent,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, getAPI, putAPI } from '../../../hooks/useFetch';
import { postInfo, commentInfo } from '../../../type/type';
import comment from '../../../image/comment.svg';
import ModifyBoard from './ModifyBoard';
import { store } from '../../../hooks/store';

const WritePage = ({ postInfo }: { postInfo: any }) => {
  const [inputInfo, setInputInfo] = useState({
    title: '',
    content: '',
  });

  const inputRef = useRef<any>([]);

  const setInputValue = (e: any) => {
    const { id, value } = e.target;
    setInputInfo({ ...inputInfo, [id]: value });
  };

  const clubID = window.location.pathname.split('/')[2];

  const submitPost = async () => {
    const [status, res] = await postAPI(inputInfo, 'json', '/api/post');

    if (status === 403) {
      alert(res.message);
    }
  };

  useEffect(() => {
    if (postInfo)
      setInputInfo({
        ...inputInfo,
        title: postInfo?.title,
        content: postInfo?.content,
      });

    inputRef?.current?.forEach((val: any, idx: number) => {
      val.value = postInfo[val.id];
    });
  }, []);

  return (
    <>
      <div className="ClubPage__div--write-wrap">
        <div>
          제목 :{' '}
          <input
            id="title"
            className="ClubPage__input--write-title"
            type="text"
            onChange={setInputValue}
            ref={(el) => (inputRef.current[0] = el)}
          ></input>
        </div>
        <textarea
          id="content"
          className="ClubPage__textarea--write-area"
          onChange={setInputValue}
          ref={(el) => (inputRef.current[1] = el)}
        ></textarea>
        <div className="ClubPage__button--submit-post" onClick={submitPost}>
          작성완료
        </div>
      </div>
    </>
  );
};

const PostList = ({
  setPostInfo,
  setCategory,
}: {
  setPostInfo: any;
  setCategory: any;
}) => {
  const clubID = window.location.pathname.split('/')[2];
  const [postList, setPostList] = useState<postInfo[]>([]);
  const fetchData = async () => {
    const [status, res] = await getAPI(`/api/post?clubId=${clubID}`);
    setPostList((postList) => [...postList, ...res]);
  };
  const navigate = useNavigate();

  const postClick = (e: SyntheticEvent) => {
    const target = e.target as HTMLSpanElement;
    setPostInfo({
      title: target.dataset.title,
      content: target.dataset.content,
      postId: target.dataset.postid,
      nickname: target.dataset.nickname,
    });
    setCategory('post');
    navigate(`/post/${clubID}/${target.dataset.postid}`);
  };

  const writeClick = () => {
    setCategory('write');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="ClubPage-postBox">
        <div className="ClubPage__div--index">
          <span className="ClubPage__span--index-ID">번호</span>
          <span className="ClubPage__span--index-Title">제목</span>
          <span className="ClubPage__span--index-Submitter">작성자</span>
        </div>
        <hr className="ClubPage__hr--index"></hr>
        {postList?.map((postData, idx) => {
          return (
            <>
              <div className="ClubPage-boardStuff" key={idx}>
                <span className="ClubPage__span--post-ID">
                  {postData.postId}
                </span>
                <span
                  className="ClubPage__span--post-Title"
                  onClick={postClick}
                  data-postid={postData.postId}
                  data-content={postData.content}
                  data-title={postData.title}
                  data-nickname={postData.nickname}
                >
                  {postData.title}
                </span>
                <span className="ClubPage__span--post-Submitter">
                  {postData.nickname}
                </span>
              </div>
              <hr className="ClubPage__hr--index"></hr>
            </>
          );
        })}
      </div>
      <div className="ClubPage__button--post-button" onClick={writeClick}>
        글쓰기
      </div>
    </>
  );
};

const Post = () => {
  const clubID = window.location.pathname.split('/')[2];
  const postId = window.location.pathname.split('/')[3];
  const [commentList, setCommentList] = useState<commentInfo[]>([]);
  const [postInfo, setPostInfo] = useState<postInfo>();
  const [userNickname, setUserNickname] = useState('');
  const [commentInput, setCommentInput] = useState({
    postId: '',
    content: '',
  });
  const [modifyMode, setModifyMode] = useState(false);

  const commentSubmit = async () => {
    const [status, res] = await postAPI(commentInput, 'json', '/api/comment');
    console.log(status);
  };

  const setInputValue = (e: any) => {
    const { id, value } = e.target;
    setCommentInput({ ...commentInput, [id]: value });
  };

  const fetchData = async () => {
    const [statusPost, resPost] = await getAPI(`/api/post?clubId=${clubID}`);

    const targetPost = resPost.find(
      (val: postInfo) => val.postId.toString() === postId
    );

    setPostInfo({ ...postInfo, ...targetPost });

    const [statusComment, resComment] = await getAPI(
      `/api/comment?postId=${targetPost.postId}`
    );
    setCommentList((commentList) => [
      ...commentList,
      ...resComment.commentData,
    ]);
    setCommentInput({ ...commentInput, postId: targetPost.postId });

    const [statusUser, resUser] = await getAPI('/api/user');

    setUserNickname(resUser.nickname);
  };

  const modify = () => {
    if (!modifyMode) setModifyMode(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {modifyMode ? (
        <ModifyBoard postInfo={postInfo!}></ModifyBoard>
      ) : (
        <div className="ClubPage-postBox">
          <div className="ClubPage__text--title">
            {postInfo?.title}
            <span className="ClubPage__text--post-writer">
              {postInfo?.nickname}
            </span>
          </div>
          <div className="ClubPage__text--contents">{postInfo?.content}</div>
          {postInfo?.nickname === userNickname ? (
            <div className="ClubPage__button--post-modify" onClick={modify}>
              글수정
            </div>
          ) : null}

          <div className="ClubPage__text--comment">
            <img src={comment} width="20px" height="20px"></img>댓글(
            {commentList?.length})
          </div>
          <hr className="ClubPage__hr--under-comment"></hr>
          <div className="ClubPage__div--all-comment">
            {commentList?.map((val, idx) => {
              return <CommentItem commentData={val}></CommentItem>;
            })}
          </div>
          <div className="ClubPage__div--submit-frame">
            <textarea
              className="ClubPage__textarea--submit-comment"
              id="content"
              onChange={setInputValue}
            ></textarea>
            <div className="ClubPage__button--submit" onClick={commentSubmit}>
              등록
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CommentItem = ({ commentData }: { commentData: any }) => {
  const [globalState, setGlobalState] = useContext(store);
  const [commentModifyMode, setCommentModifyMode] = useState(false);
  const setModifyMode = () => {
    if (commentModifyMode) setCommentModifyMode(false);
    else setCommentModifyMode(true);
  };

  const [commentInput, setCommentInput] = useState({
    content: '',
  });

  const modifySubmit = () => {
    setModifyMode();
    const modifyData = { content: commentInput.content };
    putAPI(modifyData, `/api/comment/${commentData.commentId}`);
    window.location.reload();
  };

  const setInputValue = (e: any) => {
    const { id, value } = e.target;
    setCommentInput({ ...commentInput, [id]: value });
  };

  return (
    <>
      {commentModifyMode ? (
        <div className="ClubPage__div--submit-frame">
          <textarea
            className="ClubPage__textarea--submit-comment"
            id="content"
            onChange={setInputValue}
          ></textarea>
          <div className="ClubPage__button--submit" onClick={modifySubmit}>
            수정
          </div>
        </div>
      ) : (
        <div
          className="ClubPage__div--comment-frame"
          key={commentData.commentId}
        >
          <div className="ClubPage__text--comment-nickname">
            {commentData?.nickname}
            {commentData?.nickname === globalState.nickname ? (
              <span onClick={setModifyMode}>수정</span>
            ) : null}
          </div>

          <div
            className="ClubPage__text--comment-content"
            key={commentData.commentId}
          >
            {commentData?.content}
          </div>
        </div>
      )}
    </>
  );
};

export { PostList, Post, WritePage };
