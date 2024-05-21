const express = require('express')
const router = express.Router()

const { WorkersService } = require('../use-cases/WorkersService')

/**
 * @swagger
 *  tags:
 *    name: Workers
 *    description: Workers management API
 * 
 * /:
 *   get:
 *     summary: Get all workers
 *     tags: [Workers]
 *     responses:
 *       200:
 *         description: Workers list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Ressource Not Found
 * 
 *   post:
 *     summary: Add a new worker
 *     tags: [Workers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Worker'
 *     responses:
 *       201:
 *         description: Worker added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       500:
 *         description: Internal Server Error
 * 
 * 
 * /status/{status}:
 *   get:
 *     summary: Get workers by status
 *     tags: [Workers]
 *     parameters:
 *      - in: path
 *        name: status
 *        schema:
 *          type: string
 *        required: true
 *        description: The worker status
 *     responses:
 *       200:
 *         description: Workers list with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Ressource Not Found
 * 
 * 
 * /workerName/{workerName}:
 *   get:
 *     summary: Get worker by name
 *     tags: [Workers]
 *     parameters:
 *      - in: path
 *        name: workerName
 *        schema:
 *          type: string
 *        required: true
 *        description: The worker name
 *     responses:
 *       200:
 *         description: The worker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Ressource Not Found
 * 
 *   patch:
 *     summary: Update worker by name
 *     tags: [Workers]
 *     parameters:
 *      - in: path
 *        name: workerName
 *        schema:
 *          type: string
 *        required: true
 *        description: The worker name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Worker'
 *     responses:
 *       200:
 *         description: The updated worker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Ressource Not Found
 *       500:
 *         description: Internal Server Error
 *  
 *   delete:
 *     summary: Delete worker by name
 *     tags: [Workers]
 *     parameters:
 *      - in: path
 *        name: workerName
 *        schema:
 *          type: string
 *        required: true
 *        description: The worker name
 *     responses:
 *       202:
 *         description: Worker deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Ressource Not Found  
 *      
 */

router.get('/', getWorkers)
function getWorkers(req, res, next) {
    try {
      let instance = WorkersService.getInstance();
      const workers = instance.getWorkers();
      res.status(200).json(workers)
    } catch (error) {
      console.error(`>>> ${error} ${error.stack}`)
      res.status(404).send(`Ressource Not Found`)
    }
  }


router.get('/status/:status',getWorkersByStatus)
function getWorkersByStatus(req, res, next) {
    try {
      const instance = WorkersService.getInstance();
      const workerStatus = req.params.status;
      console.log(`controller tries to get worker by status of ${workerStatus}, ${req.params}`)
      const workers = instance.getWorkersByStatus({workerStatus});
      res.status(200).json(workers)
    } catch (error) {
        switch(error.message){
          case 'cannot get Worker undefined':
            console.error(`>>> ${error} ${error.stack}`)
            res.status(404).send(`Ressource Not Found`)
            break;
          case 'cannot patch Worker': 
            console.error(`>>> ${error} ${error.stack}`)
            res.status(500).send(`Internal Server Error`)
            break;
        }
      
    }
  }

  

router.get('/workerName/:workerName',getWorkerByName)
function getWorkerByName(req, res, next) {
    try {
      const instance = WorkersService.getInstance();
      const workerName = req.params.workerName;
      console.log(`controller tries to get worker by the name of ${workerName}, ${req.params}`)
      const theWorker = instance.getWorker({workerName});
      res.status(200).json(theWorker)
    } catch (error) {
      console.error(`>>> ${error} ${error.stack}`)
      res.status(404).send(`Ressource Not Found`)
    }
  }


router.patch('/workerName/:workerName',patchWorkerByName)
function patchWorkerByName(req, res, next) {
    try {
      const instance = WorkersService.getInstance();
      const workerName = req.params.workerName;
      const payload = req.body;
      console.log(payload)
      const theWorker = instance.patchWorker({workerName,payload});
      res.status(200).json(theWorker)
    } catch (error) {
      console.error(`>>> ${error} ${error.stack}`)
      res.status(404).send(`Ressource Not Found`)
    }
  }
  


router.delete('/workerName/:workerName',deleteWorkerByName)
function deleteWorkerByName(req, res, next) {
    try {
      const instance = WorkersService.getInstance();
      const workerName = req.params.workerName;
      const theWorker = instance.deleteWorker({workerName});
      res.status(202).json(theWorker)
    } catch (error) {
      console.error(`>>> ${error} ${error.stack}`)
      res.status(404).send(`Ressource Not Found`)
    }
  }


router.post('/', addWorker)
function addWorker(req, res, next){
    try {
      let instance = WorkersService.getInstance();
      let {workerName,scriptName} = req.body;
      const worker = instance.addWorker({workerName,scriptName});
      res.status(201).json(worker);
    } catch (error) {
      console.error(`>>> ${error} ${error.stack}`)
      res.status(500).send('Internal Server Error')
    }
  }


module.exports = router