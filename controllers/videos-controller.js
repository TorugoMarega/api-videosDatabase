const mysql = require('../mysql').pool;

exports .getVideos = (req, res, next)=>{  
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `SELECT v.id id, v.titulo, descricao, url, categorias_id, c.titulo nome_categoria, cor
            FROM videos v INNER JOIN categorias c
            ON v.categorias_id = c.id`,
            (error, result, fields)=>{
                if (error){ return res.status(500).send({error:error})}
                const response = {
                    quantidade: result.length,
                    videos: result.map(video=>{
                        return{
                            id_video: video.id,
                            titulo: video.titulo,
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

exports.postVideos = (req, res, next)=>{
    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}

        conn.query(
            `INSERT INTO videos ( titulo, url, categorias_id,descricao) VALUES (?,?,?,?)`,
            [req.body.titulo, 
             req.body.url,
             req.body.categorias_id,
             req.body.descricao
            ],
            (error, result, field) =>{
                conn.release();
                if (error){ return res.status(500).send({error:error})}      
                const response = {
                    mensagem: 'Video inserido com sucesso',
                    videoCriado:{
                        id: result.id,
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

    });
}

exports.deleteVideos = (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({error:error})}

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
    });
}