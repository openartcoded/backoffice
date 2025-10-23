git checkout main
git pull
npm i && npm run format:fixAll
git add . && git commit -m "autoformat"
npm version $1
npm i
git add .
git commit -m "version $1"

echo "push tag $1..."
git push origin v$1

git push

echo "done."
