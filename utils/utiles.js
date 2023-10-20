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


//this.calificacion, ratingactual, cantidadReviewsactual)
exports.modifyRating=(calificacion, ratingactual, cantidadReviewsactual)=> {
    const valor=(cantidadReviewsactual*ratingactual)+calificacion
    let num=( valor / (cantidadReviewsactual+1) ).toFixed(1);
    return num;
}
