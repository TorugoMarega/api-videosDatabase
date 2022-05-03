const mysql = require('../mysql').pool;

//get videos com paginacao
exports.getVideos = (req, res, next)=>{  
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `
            SELECT count(id) qtde_linhas
            FROM videos
            `,
            (error, result, fields)=>{
                if (error){ return res.status(500).send({error:error})}
                if(result.length === 0){
                    return res.status(404).send({
                        mensagem:"Nenhum video cadastrado"
                    }) 
                }
                
                else{
                    const qtde_linhas = result[0].qtde_linhas
                    
                    const limit = 5//VIDEOS POR PAGINA
                    let  pag_atual = req.query.page //pega a pagina na query string
                    
                    pag_total = Math.ceil(qtde_linhas/limit)
                   
                    if(pag_atual > pag_total){
                        return res.status(404).send({
                        mensagem:"Página não encontrada",
                        quantidade_paginas:pag_total
                        }) 
                    }
                    
                    

                    if(pag_atual   == 0){//Se a pag for 0 então troca para 1
                        pag_atual = 1
                    }
                    const inicio = (pag_atual*limit)-limit;
                    
                    if(pag_atual == undefined){
                        var sql_code = `
                            SELECT v.id id, v.titulo, descricao, url, categorias_id, c.titulo nome_categoria, cor
                            FROM videos v INNER JOIN categorias c
                            ON v.categorias_id = c.id
                        `
                    }else{
                        var sql_code = `
                            SELECT v.id id, v.titulo, descricao, url, categorias_id, c.titulo nome_categoria, cor
                            FROM videos v INNER JOIN categorias c
                            ON v.categorias_id = c.id
                            LIMIT ${inicio},${limit}
                        `
                    }
                     conn.query(
                        sql_code,

                        (error, result, fields)=>{
                            conn.release();
                            if (error){ return res.status(500).send({error:error})}
            
                            if(result.length === 0){
                                return res.status(404).send({
                                    mensagem:"Nenhum video cadastrado"
                                })
                            }


                            const response = {
                                quantidade: result.length,
                                videos: result.map(video=>{
                                    return{
                                        pagina:pag_atual,
                                        id_video: video.id,
                                        titulo: video.titulo,
                                        url : video.url,
                                        descricao: video.descricao,
                                        id_categoria: video.categorias_id,
                                        nome_categoria: video.nome_categoria,
                                        request:{
                                            tipo: 'GET',
                                            descricao: 'Retorna os detalhes de um video específico',
                                            url: 'http://localhost:3000/videos/' + video.id
                                        }
                        
                                    }
                                })
                            } 
                            res.status(200).send({response})
                        }
                    ) 


                }
            }
        )
    })
}

/* exports.getVideos = (req, res, next)=>{  
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `SELECT v.id id, v.titulo, descricao, url, categorias_id, c.titulo nome_categoria, cor
            FROM videos v INNER JOIN categorias c
            ON v.categorias_id = c.id`,
            (error, result, fields)=>{
                conn.release();
                if (error){ return res.status(500).send({error:error})}

                if(result.length === 0){
                    return res.status(404).send({
                        mensagem:"Nenhum video cadastrado"
                    })
                }
                const response = {
                    quantidade: result.length,
                    videos: result.map(video=>{
                        return{
                            id_video: video.id,
                            titulo: video.titulo,
                            url : video.url,
                            descricao: video.descricao,
                            id_categoria: video.categorias_id,
                            nome_categoria: video.nome_categoria,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um video específico',
                                url: 'http://localhost:3000/videos/' + video.id
                            }
            
                        }
                    })
                } 
                res.status(200).send({response})
            }
        )
    })
} */

exports.postVideos = (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}
        
        if(req.body.categorias_id == undefined){ //define a categoria 1 como padrão caso não seja especificado o id na criação
            req.body.categorias_id = 1
        }
        conn.query(
            
            `INSERT INTO videos ( titulo, url, categorias_id,descricao) VALUES (?,?,?,?)`,
            [req.body.titulo, 
             req.body.url,
             req.body.categorias_id,
             req.body.descricao
            ],

            (error, result, field) =>{
                console.log(result)
                conn.release();
                if (error){ return res.status(500).send({error:error})}      
                const response = {
                    mensagem: 'Video inserido com sucesso',
                    videoCriado:{
                        id: result.insertId,
                        titulo: req.body.titulo,
                        url: req.body.url,
                        id_categoria: req.body.categorias_id,
                        descricao: req.body.descricao,
                        request:{
                            tipo: 'POST',
                            descricao: 'Retorna todos os videos',
                            url: 'http://localhost:3000/videos/'
                        }
                    } 
                }         
                return res.status(201).send(response);
            }
        )
    })
}

exports.getUmVideo = (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `SELECT v.id id, v.titulo titulo, descricao, url, categorias_id, c.titulo nome_categoria, cor
            FROM videos v INNER JOIN categorias c
            ON v.categorias_id = c.id
            WHERE v.id = (?)
            ` ,
            [req.params.id],

            (error, result, fields)=>{
                conn.release;
                if (error){ return res.status(500).send({error:error})}

                if(result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado video com este ID'
                    })
                }

                const response = {
                    video:{
                        id_video: result[0].id,
                        titulo: result[0].titulo,
                        descricao: result[0].descricao,
                        url: result[0].url,
                        id_categoria: result[0].categorias_id,
                        nome_categoria: result[0].nome_categoria,
                        cor_categoria: result[0].cor,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna todos os videos',
                            url: 'http://localhost:3000/videos/'
                        }
                    } 
                } 
                return res.status(200).send(response)
            }
        )
    });
}

exports.patchVideos = (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `SELECT * FROM videos WHERE id = ?`,
            [req.body.id],

            (error, result, fields) =>{
                if (error){ return res.status(500).send({error:error})}
                if(result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Vídeo não encontrado'
                    })
                }
                else{
                    if (req.body.titulo == undefined){
                        req.body.titulo = result[0].titulo;
                        //console.log('titulo param: '+req.body.titulo) //testa substituição da requisicao
                    }
                    if (req.body.url == undefined){
                        req.body.url = result[0].url;
                        //console.log('url param: '+req.body.url)
                    }
                    if (req.body.categorias_id == undefined){
                        req.body.categorias_id = result[0].categorias_id;
                        //console.log('categorias_id param: '+req.body.categorias_id)
                    }
                    if (req.body.descricao == undefined){
                        req.body.descricao = result[0].descricao;
                        //console.log('descricao param: '+req.body.descricao)
                    }
                    conn.query(
                        `UPDATE videos
                            SET titulo = ?,
                                url = ?,
                                categorias_id = ?,
                                descricao = ?
                         WHERE id = ?`,
                         
                        [
                            req.body.titulo, 
                            req.body.url,
                            req.body.categorias_id,
                            req.body.descricao,
                            req.body.id
                        ],
                        (error, result, fields)=>{
                            conn.release();
                            if (error){ return res.status(500).send({error:error})}
            
                            const response = {
                                mensagem: 'Video alterado com sucesso',
                                produtoAtualizado:{
                                    id: req.body.id,
                                    titulo: req.body.titulo,
                                    url: req.body.url,
                                    id_categoria: req.body.categorias_id,
                                    descricao: req.body.descricao,
                                    request:{
                                        tipo: 'POST',
                                        descricao: 'Retorna os detalhes de um video específico',
                                        url: 'http://localhost:3000/videos/' + req.body.id
                                    }
                                } 
                            }         
                            return res.status(202).send(response);
                        }
                    )
                }
            }
        )
    });
}

exports.deleteVideos = (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}

        conn.query(
            `SELECT * FROM videos WHERE id = ?`,
            [req.body.id],

            (error, result)=>{
                if(result.length === 0 ){
                    return res.status(404).send({
                        mensagem: 'Vídeo não encontrado'
                    })
                }
                else{
                    conn.query(
                        `DELETE FROM videos
                         WHERE id = ?`,
            
                        [req.body.id],
            
                        (error, result, fields)=>{
                            conn.release();
                            if (error){ return res.status(500).send({error:error})}
                            const response = {
                                mensagem: 'Video removido com sucesso',
                                request:{
                                    tipo: 'POST',
                                    descricao: 'Insere um video',
                                    url: 'http://localhost:3000/videos',
                                    body: {
                                        titulo: 'String',
                                        url: 'String',
                                        categorias_id: 'Number',
                                        descricao : 'String'
                                    }
                                }
                            }
                            return res.status(202).send(response)
                    })
                }
            }
        )        
    });
}

exports.getVideosPorTitulo = (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `
            SELECT v.id id, v.titulo titulo_video, descricao, url, categorias_id, c.titulo nome_categoria, cor
            FROM videos v INNER JOIN categorias c
            ON v.categorias_id = c.id
            WHERE v.titulo LIKE '%${req.query.titulo}%'
            ORDER BY v.id ASC;
            ` ,
            [req.query.titulo],

            (error, result, fields)=>{
                conn.release;
                if (error){ return res.status(500).send({error:error})}

                if(result.length === 0){
                    return res.status(404).send({
                        mensagem: 'Nenhum vídeo foi encontrado'
                    })
                }

                const response = {
                    quantidade: result.length,
                    videos:result.map(video=>{
                        return {
                            id_video: video.id_video,
                            nome_video: video.titulo_video,
                            descricao_video: video.descricao,
                            id_categoria: video.categorias_id,
                            nome_categoria: video.titulo_categoria,
                            cor_categoria: video.cor,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna todas as categorias',
                                url: 'http://localhost:3000/categorias/'
                            }
                        }
                    }) 
                } 
                return res.status(200).send(response)
            }
        )
    });
}

exports.getVideosFree = (req, res, next)=>{  
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `SELECT v.id id, v.titulo, descricao, url, categorias_id, c.titulo nome_categoria, cor
            FROM videos v INNER JOIN categorias c
            ON v.categorias_id = c.id
            ORDER BY RAND()
            LIMIT 5;
            `, 
            (error, result, fields)=>{
                conn.release();
                if (error){ return res.status(500).send({error:error})}

                if(result.length === 0){
                    return res.status(404).send({
                        mensagem:"Nenhum video cadastrado"
                    })
                }
                const response = {
                    quantidade: result.length,
                    videos: result.map(video=>{
                        return{
                            id_video: video.id,
                            titulo: video.titulo,
                            url : video.url,
                            descricao: video.descricao,
                            id_categoria: video.categorias_id,
                            nome_categoria: video.nome_categoria,
                            request:{
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um video específico',
                                url: 'http://localhost:3000/videos/' + video.id
                            }
            
                        }
                    })
                } 
                res.status(200).send({response})
            }
        )
    })
}