/*
 * This file is part a custom application package.
 * (c) 2014-2015 Openovate Labs
 */

/* Get Application
-------------------------------*/
module.exports	= require('./controller')

/* Set Paths
-------------------------------*/
.setPaths()

/* Set Database
-------------------------------*/
.setDatabase()

/* Set Queue
-------------------------------*/
.setQueue()

/* Load Events
-------------------------------*/
.loadEvents()

/* Trigger Init Event
-------------------------------*/
.trigger('init')

/* Start Server
-------------------------------*/
.startServer()

/* Trigger Start Event
-------------------------------*/
.trigger('start');