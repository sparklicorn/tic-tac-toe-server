import _ from 'lodash';

/**
 * An Event has a name and some data.
 * Neither should be changed after creation.
 */
class Event {
  readonly name: string;
  readonly data: { [key: string]: any };

  constructor(name: string, data: { [key: string]: any }) {
    this.name = name;
    this.data = data;
  }

  copy() {
    return new Event(
      this.name,
      _.cloneDeep(this.data)
    );
  }
}

export default Event;
