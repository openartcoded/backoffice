
git checkout main
git pull

npm version v$1
npm i
git add .

echo "push tag v$1..."
git push origin v$1

echo "push docker image v$1..."

docker build -t nbittich/back-office:v$1 .
docker tag nbittich/back-office:v$1 nbittich/back-office:v$1
docker push nbittich/back-office:v$1

git push

echo "done."