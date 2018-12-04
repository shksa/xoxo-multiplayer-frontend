echo "deploying"
set -e

echo "deleting old version of the build"
rm -rf ~/xoxo-multiplayer/xoxo-multiplayer-frontend

echo "pushing new version of the build"
scp -r build sreekar339@139.59.93.218:~/xoxo-multiplayer/xoxo-multiplayer-frontend

