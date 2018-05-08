import { Stores } from '../stores';
import { History } from 'history';

export class ProfileActions {
  public static fieldMessage = 'This field is required.';

  constructor(private stores: Partial<Stores>) {
  }

  handleFormSubmit = async (history: History) => {
    const store = this.stores.airmanProfileManagerStore!;
    const formErrors = {};
    try {

      if (store.airman.siteId === -1) {
        const key = 'siteId';
        formErrors[key] = ProfileActions.fieldMessage;
      }

      if (store.airman.squadronId === -1) {
        const key = 'squadronId';
        formErrors[key] = ProfileActions.fieldMessage;
      }

      store.setLoading(true);

      await store.addAirman();
      store.setErrors({});

      history.push(`/flights/${store.airman.id}`);
    } catch (e) {
      store.setErrors(Object.assign({}, e, formErrors));
    } finally {
      store.setLoading(false);
    }
  }
}