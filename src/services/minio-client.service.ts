import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from '../interfaces/file.model'
import { uploadRequestModel } from 'src/interfaces/request-upload.model';
import { generalReponse } from 'src/interfaces/reponse.model';
import { v4 as uuidv4 } from 'uuid';
import { Constants } from 'src/common/constants.enum';
import { BucketItemWithMetadata, BucketStream } from 'minio';
import { rejects } from 'assert';

@Injectable()
export class MinioClientService {


    //#region vars
    private readonly logger: Logger;
    //#endregion

    /**
     * Creates an instance of MinioClientService.
     * @param {MinioService} minio
     */
    constructor(private readonly minio: MinioService) {
        this.logger = new Logger('MinioService');
    }

    /**
     * Get minio client
     * * npm de minIO que posee los metodo propios de la herramienta a utilizar
     * @readonly
     */
    public get client() {
        return this.minio.client;
    }

    /**
     * Metodo de carga de archivos a minIO
     * @param {BufferedFile} file
     * @param {uploadRequestModel} fileResquet
     * @return {*} 
     * @memberof MinioClientService
     */
    public async upload(
        file: BufferedFile,
        fileResquet: uploadRequestModel
    ) {
        try {
            const fileName = file.originalname;
            await this.client.putObject( // Metodo de minIO para cargar archivos
                fileResquet.bucketName,
                fileResquet.path == '' ? fileName : `${fileResquet.path}/${fileName}`,
                file.buffer
            )

            return {
                fileName: fileName,
            };
        } catch (error) {
            this.throwError(error)
        }
    }

    public async delete(objetName: string, fileResquet: uploadRequestModel) {
        this.client.removeObject(fileResquet.bucketName, objetName, function (err) {
            if (err)
                this.throwError(err.message)
        });
    }

    /**
     * Metodo para obtener los objetos del bucket
     * * minIO en su metodo de listObject retorna un stream
     * * Del stream se leen 3 eventos: data(contiene los objetos), error (contiene los errores), end (finalizacion del evento)
     * @param {string} bucketName
     * @param {string} path
     * @return {*} 
     * @memberof MinioClientService
     */
    public async getObjectByClient(bucketName: string, path: string) {
        let data = []
        try {
            //Metodo de minIO para lectura de objetos. Parametros: nombre del bucket, prefijo (ruta), falso para que detecte los directorios
            let stream = this.client.listObjects(bucketName, path, false) 
            await new Promise(function (resolve, rejects) {
                stream.on('error', function (err) {
                    rejects(err)
                })
                stream.on('data', function (obj) {
                    data.push(obj)
                })
                stream.on("end", function () {
                    resolve(0)
                })
            })

            return this.returnGeneralReponse(data, Constants.MSG_SUCCESS_LIST)

        } catch (error) {
            this.throwError(error)
        }
    }

    /**
     *
     * Retorna respuesta de Error 
     * @private
     * @param {*} error
     * @param {*} [code]
     * @memberof MinioClientService
     */
    private throwError(error, code?) {
        let reponse: generalReponse = {
            statusCode: code ? code : HttpStatus.BAD_REQUEST,
            message: error.message,
            status: Constants.ERROR,
            uuid: uuidv4()
        }


        throw new HttpException(
            {
                reponse
            }, HttpStatus.BAD_REQUEST, {
            cause: error
        }
        );
    }

    /**
     *
     * Retorna repuesta general
     * @private
     * @param {*} response
     * @return {*} 
     * @memberof MinioClientService
     */
    private returnGeneralReponse(response: any, message: string) {
        let reponse: generalReponse = {
            statusCode: HttpStatus.OK,
            message: message,
            uuid: uuidv4(),
            status: Constants.SUCCESSFUL,
            response: response
        }

        return reponse;
    }

}

