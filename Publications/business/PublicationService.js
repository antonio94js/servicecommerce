import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import Publication from '../models/Publication';


const setData = (publicationData, publication) => {
   let { publicationDetail, name } = publicationData;
   publication.publicationDetail = !publicationDetail ? publication.publicationDetail : publicationDetail;
   publication.name = !name ? publication.name : name;
};

const createNewPublication = (publicationData) => {

    return Publication //return a promise
        .create(publicationData)
        .then((publication) => {

            return MessageHandler.messageGenerator("Publication created succefully", true); //resolve the promise
        })
        .catch((err) => {
            if (err.code === 11000 || err.code === 11001)
                throw MessageHandler.errorGenerator("The publication already exist", 409); //reject the promise
            // console.log("aqui" + err);
            throw MessageHandler.errorGenerator("Something wrong happened creating publication", 500); //reject the promise
        });

};

const updatePublication = (publicationData) => {
   setData(publicationData, publicationData.product);

   return publicationData.publication.save()
      .then((product) => {
         return MessageHandler.messageGenerator(
            "The publication was updated successfully", true);
         }).catch((err) => {
            return MessageHandler.errorGenerator("Something wrong happened updating publication", 500);
         });
};


export default {
    createNewPublication
};
