import axios from 'axios';

class Service {

    getAll(resource) {
        let API_BASE_URL = "http://54.254.182.252:5000/" + resource;
        return axios.get(API_BASE_URL);
    }

    createResource(resource, value){
        let API_BASE_URL = "http://54.254.182.252:5000/" + resource;
        return axios.post(API_BASE_URL, value);
    }

    getResourceById(resource, id){
        let API_BASE_URL = "http://54.254.182.252:5000/" + resource + '/' + id;
        return axios.get(API_BASE_URL);
    }

    updateResourceById(resource, value, id){
        let API_BASE_URL = "http://54.254.182.252:5000/" + resource + '/' + id;
        return axios.put(API_BASE_URL, value);
    }

    deleteResourceById(resource, id){
        let API_BASE_URL = "http://54.254.182.252:5000/" + resource + '/' + id;
        return axios.delete(API_BASE_URL);
    }
}

export default new Service()