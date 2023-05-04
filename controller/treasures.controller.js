const { selectTreasures, filterTreasures } = require("../models/treasures.model");

exports.getTreasures = (req, res) => {
    const sort = req.query.sort_by
    const orderBy = req.query.order
    const colour = req.query.colour
    const filterQuery = {...req.query}
    delete filterQuery.order
    delete filterQuery.sort_by
    if (Object.keys(filterQuery).length !== 0) {
        if (Object.keys(filterQuery).length > 1) {
            res.status(400).send({ error : "too many queries"})
        }
        else {
            filterTreasures(filterQuery).then((result) => {
                res.status(200).send({treasures : result})
            })
        }
    }
    else {
    selectTreasures(sort, orderBy).then((result) => {

        res.status(200).send({ treasures : result});
    }).catch((err) => {
        res.status(err.status).send({ error: err.msg})
    })
}
}