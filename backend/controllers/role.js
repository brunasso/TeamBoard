import role from '../models/role.js';

const registerRole = async(req, res) => { // Se realizan controles de datos vacíos
    if (!req.body.name || !req.body.description)  res.status(400).send("Incomplete data")
 
    const existingRole = await role.findOne({name: req.body.name}); // Corroboramos que el dato que vamos a ingresar no se encuentre ya en la base de datos.
    if(existingRole)    return res.status(400).send("The role already exist");

    const roleSchema = new role({ // Creamos un nuevo role a ingresar tomando el molde de "models" y colocando los datos que nos envían del front.
        name: req.body.name,
        description: req.body.description,
        dbStatus: true,
    });

    const result = await roleSchema.save(); // Se guarda en la base de datos el archivo / Save file in db
    if (!result) return res.status(400).send("Failed to register role");

    return res.status(200).send({result});
}

const listRole = async (req,res) => {
    const roleSchema = await role.find();
    if(!roleSchema || roleSchema.length == 0)return res.status(400).send("Empty role list");
    return res.status(200).send({roleSchema});
}
// Find function
const findRole = async(req , res) => { // Buscamos un solo rol dentro de la bd / We search for a rol inside db.
    const roleId = await role.findOne({_id: req.params["_id"]})
    return !roleId ? res.status(400).send("No search results"): res.status(200).send({roleId});
}
// Update function
const updateRole = async(req, res) =>{ // Controlamos que no haya datos incompletos // We control incomplete data
    if (!req.body.name || !req.body.description)  res.status(400).send("Incomplete data");

    const existingRole = await role.findOne({name: req.body.name, description: req.body.description}); // Corroboramos que el dato que vamos a ingresar no se encuentre ya en la base de datos.
    if(existingRole)    return res.status(400).send("The role already exist");

    const roleUpdate = await role.findByIdAndUpdate(req.body._id, {name: req.body.name, description: req.body.description});

    return !roleUpdate ? res.status(400).send("Error editing role"): res.status(200).send({roleUpdate});
}


const deleteRole = async(req, res) => {
    const roleDelete = await role.findByIdAndDelete({_id: req.params["_id"]});

    return !roleDelete ?  res.status(400).send("Role no found") : res.status(200).send("Role delete");
}

// Exportamos las constantes para que puedan ser utilizadas en las rutas.
export default { registerRole, listRole, findRole, updateRole, deleteRole};