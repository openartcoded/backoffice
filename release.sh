
git checkout main
git pull

npm version $1
npm i
git add .
git commit -m "version $1"

echo "push tag $1..."
git push origin v$1

git push

echo "done."