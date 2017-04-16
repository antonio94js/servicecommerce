const Microservices = []

export const stopMicroservices = () => {
    // console.log(Microservices);
    for (const Microservice of Microservices) {
        for (const property in Microservice) {
            if (Microservice.hasOwnProperty(property)) {
                Microservice[property].stop();
            }
        }
    }

    return true;
}

export const registerMicroservice = microservice => Microservices.push(microservice);
