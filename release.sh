
git checkout main
git pull

npm version v$1
npm i
git add .

echo "push tag v$1..."
git push origin v$1

echo "done."