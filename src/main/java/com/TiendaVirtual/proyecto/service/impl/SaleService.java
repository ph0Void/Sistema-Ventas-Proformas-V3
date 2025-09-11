package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.persistence.model.*;
import com.TiendaVirtual.proyecto.persistence.repository.*;
import com.TiendaVirtual.proyecto.presentation.dto.req.ClientReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.req.OrderDetailReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.req.SaleReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.SaleDto;
import com.TiendaVirtual.proyecto.service.ISaleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class SaleService implements ISaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ClientRepository clientRepository;

    @Override
    public SaleDto getById(Long idOrder, Long idSeller) {
        Sale sale = saleRepository.findById(idOrder)
                .orElseThrow(() -> new IllegalArgumentException("No existe venta con id: " + idOrder));

        // Validar que el vendedor sea el propietario
        if (!sale.getSeller().getId().equals(idSeller)) {
            throw new IllegalArgumentException("No tiene permisos para ver esta venta");
        }

        return SaleDto.toDto(sale);
    }

    public List<SaleDto> getAllOrdersBySeller(Long idSeller) {
        List<Sale> sales = saleRepository.findBySellerId(idSeller);
        return sales.stream().map(SaleDto::toDto).toList();
    }

    @Override
    public Page<SaleDto> getAllPaginated(Long idSeller, Pageable pageable) {
        Page<Sale> sales = saleRepository.findBySellerId(idSeller, pageable);
        return sales.map(SaleDto::toDto);
    }

    @Override
    @Transactional
    public SaleDto createOrder( SaleReqDto order, Long idSeller) {
        // Validar vendedor
        Seller seller = sellerRepository.findById(idSeller)
                .orElseThrow(() -> new IllegalArgumentException("No existe vendedor con id: " + idSeller));

        // Validar que haya productos en la orden
        if (order.getOrderDetails() == null || order.getOrderDetails().isEmpty()) {
            throw new IllegalArgumentException("La orden debe contener al menos un producto");
        }

        // Verificar stock y obtener productos
        List<Product> productsToUpdate = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderDetailReqDto detailReq : order.getOrderDetails()) {
            // Validar cantidad
            if (detailReq.getQuantity() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            // Buscar producto
            Product product = productRepository.findById(detailReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "No existe producto con id: " + detailReq.getProductId()));

            // Verificar stock disponible
            if (product.getStock() < detailReq.getQuantity()) {
                throw new IllegalArgumentException(
                        String.format("Stock insuficiente para el producto '%s'. Stock disponible: %d, solicitado: %d",
                                product.getName(), product.getStock(), detailReq.getQuantity()));
            }

            // Descontar stock
            product.setStock(product.getStock() - detailReq.getQuantity());
            productsToUpdate.add(product);

            // Calcular subtotal
            double subtotal = product.getPrice() * detailReq.getQuantity();
            totalAmount += subtotal;
        }

        // Crear o buscar cliente
        Client client = createOrFindClient(order.getClient());

        // Crear venta
        Sale sale = new Sale();
        sale.setSeller(seller);
        sale.setClient(client);
        sale.setTotal(totalAmount);

        // Guardar venta
        Sale savedSale = saleRepository.save(sale);

        // Crear detalles de la orden
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (int i = 0; i < order.getOrderDetails().size(); i++) {
            OrderDetailReqDto detailReq = order.getOrderDetails().get(i);
            Product product = productsToUpdate.get(i);

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setProduct(product);
            orderDetail.setSale(savedSale);
            orderDetail.setQuantity(detailReq.getQuantity());
            orderDetail.setSubTotal(product.getPrice() * detailReq.getQuantity());

            orderDetails.add(orderDetail);
        }

        // Guardar detalles
        orderDetailRepository.saveAll(orderDetails);

        // Actualizar stock de productos
        productRepository.saveAll(productsToUpdate);

        // Actualizar la venta con los detalles
        savedSale.setOrderDetails(orderDetails);

        // Convertir a DTO respuesta
        // SaleDto saleDto = new SaleDto();
        // BeanUtils.copyProperties(savedSale, saleDto);

        // return saleDto;
        return SaleDto.toDto(savedSale);
    }

    @Override
    @Transactional
    public SaleDto updateOrder(Long idOrder, SaleReqDto order, Long idSeller) {
        // Buscar venta existente
        Sale existingSale = saleRepository.findById(idOrder)
                .orElseThrow(() -> new IllegalArgumentException("No existe venta con id: " + idOrder));

        // Validar que el vendedor sea el propietario
        if (!existingSale.getSeller().getId().equals(idSeller)) {
            throw new IllegalArgumentException("No tiene permisos para modificar esta venta");
        }

        // Revertir stock de los productos anteriores
        for (OrderDetail detail : existingSale.getOrderDetails()) {
            Product product = detail.getProduct();
            product.setStock(product.getStock() + detail.getQuantity());
            productRepository.save(product);
        }

        // Eliminar detalles anteriores
        orderDetailRepository.deleteAll(existingSale.getOrderDetails());

        // Recrear la venta con los nuevos datos
        existingSale.getOrderDetails().clear();

        // Aplicar la misma lógica de createOrder para los nuevos productos
        List<Product> productsToUpdate = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderDetailReqDto detailReq : order.getOrderDetails()) {
            if (detailReq.getQuantity() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            Product product = productRepository.findById(detailReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "No existe producto con id: " + detailReq.getProductId()));

            if (product.getStock() < detailReq.getQuantity()) {
                throw new IllegalArgumentException(
                        String.format("Stock insuficiente para el producto '%s'. Stock disponible: %d, solicitado: %d",
                                product.getName(), product.getStock(), detailReq.getQuantity()));
            }

            product.setStock(product.getStock() - detailReq.getQuantity());
            productsToUpdate.add(product);

            double subtotal = product.getPrice() * detailReq.getQuantity();
            totalAmount += subtotal;
        }

        // Actualizar total
        existingSale.setTotal(totalAmount);

        // Crear nuevos detalles
        List<OrderDetail> newOrderDetails = new ArrayList<>();
        for (int i = 0; i < order.getOrderDetails().size(); i++) {
            OrderDetailReqDto detailReq = order.getOrderDetails().get(i);
            Product product = productsToUpdate.get(i);

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setProduct(product);
            orderDetail.setSale(existingSale);
            orderDetail.setQuantity(detailReq.getQuantity());
            orderDetail.setSubTotal(product.getPrice() * detailReq.getQuantity());

            newOrderDetails.add(orderDetail);
        }

        // Guardar cambios
        orderDetailRepository.saveAll(newOrderDetails);
        productRepository.saveAll(productsToUpdate);
        Sale updatedSale = saleRepository.save(existingSale);

//        SaleDto saleDto = new SaleDto();
//        BeanUtils.copyProperties(updatedSale, saleDto);
//
//        return saleDto;
        return SaleDto.toDto(updatedSale);
    }

    @Override
    @Transactional
    public void deleteOrder(Long idOrder, Long idSeller) {
        // Buscar venta
        Sale sale = saleRepository.findById(idOrder)
                .orElseThrow(() -> new IllegalArgumentException("No existe venta con id: " + idOrder));

        // Validar permisos
        if (!sale.getSeller().getId().equals(idSeller)) {
            throw new IllegalArgumentException("No tiene permisos para eliminar esta venta");
        }

        // Revertir stock
        for (OrderDetail detail : sale.getOrderDetails()) {
            Product product = detail.getProduct();
            product.setStock(product.getStock() + detail.getQuantity());
            productRepository.save(product);
        }

        // Eliminar venta (cascade eliminará los detalles)
        saleRepository.delete(sale);
    }

    /**
     * Crear o buscar cliente por DNI
     * @param clientReq Datos del cliente
     * @return Cliente existente o nuevo
     */
    private Client createOrFindClient(ClientReqDto clientReq) {
        // Buscar cliente existente por DNI
        return clientRepository.findByDni(clientReq.getDni())
                .orElseGet(() -> {
                    // Crear nuevo cliente
                    Client newClient = new Client();
                    BeanUtils.copyProperties(clientReq, newClient);
                    return clientRepository.save(newClient);
                });
    }
}