const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const uuid = require('uuid/v1')

const nodeAddress = uuid().split('-').join('') // how to generate id auto
const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extened: false}))

app.get('/blockchain', (req, res) => {
  res.send(bitcoin)
})

app.post('/transaction', (req,res) => {
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  res.json({ note: `Transaction will be add block in block ${blockIndex}` })
})

app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock()
  const previousBlockHash = lastBlock['hash'] // is in function createnewblock
  const currentBlockData = {
    transaction: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  }

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

  bitcoin.createNewTransaction(12.5, "00", nodeAddress)

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)
  res.json({
    note: "new block mined successfully",
    block: newBlock
  })
})
app.listen(3000, () => {
  console.log('Listening on port 3000000000')
})