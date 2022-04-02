set -e
docker build -t nbittich/back-office .
docker tag nbittich/back-office nbittich/back-office
docker push nbittich/back-office