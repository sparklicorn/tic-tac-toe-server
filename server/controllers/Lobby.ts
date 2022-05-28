export const postJoinLobby = {
  method: 'post',
  path: '/join-lobby',
  callback: (req, res) => {
    // generate player id (some random hashy thing)
    // add to player pool (maybe this should trigger server event)
    // respond with success + player id
    console.log('POST join-lobby');
    res.send('joining lobby thing or whatever');
  }
};
