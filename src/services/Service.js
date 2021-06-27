import axios from "axios";

class Service {

  post(url, payload) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
    };
    fetch(url, requestOptions).then((res) => {
      return res.json();
    });
  }

  get(url) {
    console.log("Get Called for : " + url)
    fetch(url)
        .then(response => {console.log(response.json());})
  }

  put(url, payload) {   
    const requestOptions = {
      method: "PUT",
      body: JSON.stringify(payload),
    };
    fetch(url, requestOptions).then((res) => {
      return res.json();
    });
  }

  deleteResource(url) {
    fetch(url, { method: "DELETE" }).then((res) => {
      return res.json();
    });
  }

  getAll(resource) {
    let API_BASE_URL = "http://54.254.182.252:5000/" + resource;
    return axios.get(API_BASE_URL);
  }

  createResource(resource, value) {
    let API_BASE_URL = "http://54.254.182.252:5000/" + resource;
    return axios.post(API_BASE_URL, value);
  }

  getResourceById(resource, id) {
    let API_BASE_URL = "http://54.254.182.252:5000/" + resource + "/" + id;
    return axios.get(API_BASE_URL);
  }

  updateResourceById(resource, value, id) {
    let API_BASE_URL = "http://54.254.182.252:5000/" + resource + "/" + id;
    return axios.put(API_BASE_URL, value);
  }

  deleteResourceById(resource, id) {
    let API_BASE_URL = "http://54.254.182.252:5000/" + resource + "/" + id;
    return axios.delete(API_BASE_URL);
  }
}

export default new Service();
