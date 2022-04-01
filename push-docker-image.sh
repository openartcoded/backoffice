set -e
docker build -t artcoded/back-office .
docker tag artcoded/back-office artcoded:5000/artcoded/back-office
docker push artcoded:5000/artcoded/back-office