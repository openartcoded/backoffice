
git checkout main
git pull

npm version v$1
npm i
git add .

echo "push tag v$1..."
git push origin v$1

echo "push docker image v$1..."

docker build -t artcoded/back-office:v$1 .
docker tag artcoded/back-office:v$1 artcoded:5000/artcoded/back-office:v$1
docker push artcoded:5000/artcoded/back-office:v$1

git push

echo "done."