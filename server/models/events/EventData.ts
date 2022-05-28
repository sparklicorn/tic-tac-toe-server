
type EventData = {
  gameId: string,
  name: string,
  data: {
    [key: string]: any
  }
};

export const createEventData = (data: {[key: string]: any}): EventData => {
  if (!data.gameId) {
    throw Error('ERROR gameId must be defined');
  }
  if (typeof data.gameId != 'string') {
    throw Error('ERROR gameId must be a string');
  }
  if (!data.name) {
    throw Error('ERROR name must be defined');
  }
  if (typeof data.name != 'string') {
    throw Error('ERROR name must be a string');
  }
  if (data.data && typeof data.data !== 'object') {
    throw Error('ERROR name must be an object');
  }

  return {
    gameId: data.gameId,
    name: data.name,
    data: data.data
  };
}

export default EventData;
