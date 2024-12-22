import Button from 'primevue/button';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

export default {
    install: (app) => {
        app.component('PrimeButton', Button);
        app.component('PrimePassword', Password);
        app.component('PrimeInputText', InputText);
        app.component('PrimeCheckbox', Checkbox);
        app.component('PrimeCard', Card);
        app.component('PrimeSpinner', ProgressSpinner);
        app.component('PrimeToast', Toast);
    }
};