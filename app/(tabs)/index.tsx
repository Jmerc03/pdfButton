import {  StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';
import AWS from 'aws-sdk';
import { Readable } from 'stream';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

export default function HomeScreen() {
  const download = () => {
    const pdfUrl = "../../assets/Hope.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Hope.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const open = () => {
    const pdfUrl = "../../assets/Hope.pdf";
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = pdfUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const DownloadPDFButton = () => {
    const s3 = new AWS.S3({region: "us-east-1"});
    
    // Create the parameters for calling listObjects
    var bucketParams = {
      Bucket: "fec-dashboard-bucket",
    };

    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }

  const asStream = (response: GetObjectCommandOutput) => {
    return response.Body as Readable;
  };
  
  const asBuffer = async (response: GetObjectCommandOutput) => {
    const stream = asStream(response);
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  };
  
  const asString = async (response: GetObjectCommandOutput) => {
    const buffer = await asBuffer(response);
    return buffer.toString();
  };

  const downloadAWS = () => {
    const link = document.createElement('a');
    link.href = '.../durl?k=my.pdf';
    link.download = `my.pdf`;
    link.click();
  }


  
  return (
    <View>
      <TouchableOpacity onPress={downloadAWS} style={styles.button}> 
        <Text style={styles.text}>Download</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={open} style={styles.button}> 
        <Text style={styles.text}>Open</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    color: "white",
    fontSize: 16,
  }
});
