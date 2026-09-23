package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Batch struct {
	BatchID      string `json:"batchId"`
	MedicineName string `json:"medicineName"`
	Quantity     int    `json:"quantity"`
	Manufacturer string `json:"manufacturer"`
	CurrentOwner string `json:"currentOwner"`
	Status       string `json:"status"`
	CreatedAt    string `json:"createdAt"`
	UpdatedAt    string `json:"updatedAt"`
}

func (s *SmartContract) CreateBatch(
	ctx contractapi.TransactionContextInterface,
	batchID string,
	medicineName string,
	quantity int,
	manufacturer string,
) error {

	exists, err := s.BatchExists(ctx, batchID)
	if err != nil {
		return err
	}

	if exists {
		return fmt.Errorf("batch %s already exists", batchID)
	}

	if batchID == "" {
		return fmt.Errorf("batch ID cannot be empty")
	}

	if medicineName == "" {
		return fmt.Errorf("medicine name cannot be empty")
	}

	if quantity <= 0 {
		return fmt.Errorf("quantity must be greater than zero")
	}

	if manufacturer == "" {
		return fmt.Errorf("manufacturer cannot be empty")
	}

	now := time.Now().UTC().Format(time.RFC3339)

	batch := Batch{
		BatchID:      batchID,
		MedicineName: medicineName,
		Quantity:     quantity,
		Manufacturer: manufacturer,
		CurrentOwner: manufacturer,
		Status:       "CREATED",
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	batchJSON, err := json.Marshal(batch)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(batchID, batchJSON)
}
func (s *SmartContract) GetBatch(
	ctx contractapi.TransactionContextInterface,
	batchID string,
) (*Batch, error) {

	batchJSON, err := ctx.GetStub().GetState(batchID)
	if err != nil {
		return nil, err
	}

	if batchJSON == nil {
		return nil, fmt.Errorf("batch %s does not exist", batchID)
	}

	var batch Batch

	err = json.Unmarshal(batchJSON, &batch)
	if err != nil {
		return nil, err
	}

	return &batch, nil
}
func (s *SmartContract) TransferBatch(
	ctx contractapi.TransactionContextInterface,
	batchID string,
	currentOwner string,
	newOwner string,
) error {

	if currentOwner == "" {
		return fmt.Errorf("current owner cannot be empty")
	}

	if newOwner == "" {
		return fmt.Errorf("new owner cannot be empty")
	}

	if currentOwner == newOwner {
		return fmt.Errorf("current owner and new owner cannot be the same")
	}

	batch, err := s.GetBatch(ctx, batchID)
	if err != nil {
		return err
	}

	if batch.CurrentOwner != currentOwner {
		return fmt.Errorf("only the current owner can transfer batch %s", batchID)
	}

	if batch.Status != "CREATED" && batch.Status != "RECEIVED" {
		return fmt.Errorf("batch %s cannot be transferred in status %s", batchID, batch.Status)
	}

	batch.CurrentOwner = newOwner
	batch.Status = "IN_TRANSIT"
	batch.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	batchJSON, err := json.Marshal(batch)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(batchID, batchJSON)
}
func (s *SmartContract) ReceiveBatch(
	ctx contractapi.TransactionContextInterface,
	batchID string,
	receiver string,
) error {

	if receiver == "" {
		return fmt.Errorf("receiver cannot be empty")
	}

	batch, err := s.GetBatch(ctx, batchID)
	if err != nil {
		return err
	}

	if batch.Status != "IN_TRANSIT" {
		return fmt.Errorf("batch %s cannot be received in status %s", batchID, batch.Status)
	}

	if batch.CurrentOwner != receiver {
		return fmt.Errorf("only the destination owner can receive batch %s", batchID)
	}

	batch.Status = "RECEIVED"
	batch.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	batchJSON, err := json.Marshal(batch)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(batchID, batchJSON)
}
func (s *SmartContract) MarkAtPharmacy(
	ctx contractapi.TransactionContextInterface,
	batchID string,
) error {

	batch, err := s.GetBatch(ctx, batchID)
	if err != nil {
		return err
	}

	if batch.Status != "RECEIVED" {
		return fmt.Errorf(
			"batch %s cannot be marked at pharmacy in status %s",
			batchID,
			batch.Status,
		)
	}

	batch.Status = "AT_PHARMACY"
	batch.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	batchJSON, err := json.Marshal(batch)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(batchID, batchJSON)
}
func (s *SmartContract) MarkAvailable(
	ctx contractapi.TransactionContextInterface,
	batchID string,
) error {

	batch, err := s.GetBatch(ctx, batchID)
	if err != nil {
		return err
	}

	if batch.Status != "AT_PHARMACY" {
		return fmt.Errorf(
			"batch %s cannot be marked available in status %s",
			batchID,
			batch.Status,
		)
	}

	batch.Status = "AVAILABLE"
	batch.UpdatedAt = time.Now().UTC().Format(time.RFC3339)

	batchJSON, err := json.Marshal(batch)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(batchID, batchJSON)
}
func (s *SmartContract) GetBatchHistory(
	ctx contractapi.TransactionContextInterface,
	batchID string,
) ([]map[string]interface{}, error) {

	exists, err := s.BatchExists(ctx, batchID)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, fmt.Errorf("batch %s does not exist", batchID)
	}

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(batchID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var history []map[string]interface{}

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		record := make(map[string]interface{})

		record["txId"] = response.TxId
		record["timestamp"] = response.Timestamp.String()
		record["isDelete"] = response.IsDelete

		if response.Value != nil {
			var batch Batch
			if err := json.Unmarshal(response.Value, &batch); err == nil {
				record["batch"] = batch
			}
		}

		history = append(history, record)
	}

	return history, nil
}
func (s *SmartContract) BatchExists(
	ctx contractapi.TransactionContextInterface,
	batchID string,
) (bool, error) {

	batchJSON, err := ctx.GetStub().GetState(batchID)
	if err != nil {
		return false, err
	}

	return batchJSON != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		panic(err)
	}

	if err := chaincode.Start(); err != nil {
		panic(err)
	}
}
