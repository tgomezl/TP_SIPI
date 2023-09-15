exports.filterObj = (obj, allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el]
        };
    });
    return newObj;
};

exports.calcRating=(calificacion, ratingactual, cantidadReviews)=> {
    const valor=(cantidadReviews*ratingactual)+calificacion
    return (valor/(cantidadReviews+1))
}



exports.modifyRating=(calificacion, ratingactual, cantidadReviewsactual)=> {
    const valor=(cantidadReviewsactual*ratingactual)+calificacion
    return (Math.ceil(valor/(cantidadReviewsactual+1)))
}
