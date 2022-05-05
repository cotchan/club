FROM nginx

# '프록시 기능을 위한 엔진엑스 설정 파일'을 컨테이너 안에 있는 엔진엑스 설정파일로 넣어주기
# default.conf에 작성한 내용을 컨테이너에서 실행될 nginx에도 적용될 수 있게 COPY 명령어로 복사
COPY ./default.conf /etc/nginx/conf.d/default.conf