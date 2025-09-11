package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.persistence.model.*;
import com.TiendaVirtual.proyecto.persistence.repository.*;
import com.TiendaVirtual.proyecto.presentation.dto.req.ClientReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.req.OrderDetailReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.req.ProformaReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.ProformaDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.SaleDto;
import com.TiendaVirtual.proyecto.service.IProformaService;
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
public class ProformaService implements IProformaService {

    private final ProformaRepository proformaRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ClientRepository clientRepository;

    @Override
    public ProformaDto getById(Long idProforma, Long idSeller) {
        Proforma proforma = proformaRepository.findById(idProforma)
                .orElseThrow(() -> new IllegalArgumentException("No existe proforma con id: " + idProforma));

        // Validar que el vendedor sea el propietario
        if (!proforma.getSeller().getId().equals(idSeller)) {
            throw new IllegalArgumentException("No tiene permisos para ver esta proforma");
        }

        return ProformaDto.toDto(proforma);
    }

    @Override
    public List<ProformaDto> getAllOrdersBySeller(Long idSeller) {
        List<Proforma> proformas = proformaRepository.findBySellerId(idSeller);
        List<ProformaDto> proformaDtos = new ArrayList<>();
        for (Proforma proforma : proformas) {
            //ProformaDto dto = new ProformaDto();
            //BeanUtils.copyProperties(proforma, dto);
            ProformaDto dto = ProformaDto.toDto(proforma);
            proformaDtos.add(dto);
        }
        return proformaDtos;
    }

    @Override
    public Page<ProformaDto> getAllPaginated(Long idSeller, Pageable pageable) {
        Page<Proforma> sales = proformaRepository.findBySellerId(idSeller, pageable);
        return sales.map(ProformaDto::toDto);
    }

    @Override
    @Transactional
    public ProformaDto createOrder(ProformaReqDto order, Long idSeller) {
        // Validar vendedor
        Seller seller = sellerRepository.findById(idSeller)
                .orElseThrow(() -> new IllegalArgumentException("No existe vendedor con id: " + idSeller));

        // Validar que haya productos en la proforma
        if (order.getOrderDetails() == null || order.getOrderDetails().isEmpty()) {
            throw new IllegalArgumentException("La proforma debe contener al menos un producto");
        }

        // Verificar disponibilidad de productos (SIN descontar stock)
        double totalAmount = 0.0;
        List<OrderDetail> orderDetails = new ArrayList<>();

        for (OrderDetailReqDto detailReq : order.getOrderDetails()) {
            // Validar cantidad
            if (detailReq.getQuantity() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            // Buscar producto
            Product product = productRepository.findById(detailReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "No existe producto con id: " + detailReq.getProductId()));

            // Verificar disponibilidad (NO descontar stock)
            if (product.getStock() < detailReq.getQuantity()) {
                throw new IllegalArgumentException(
                        String.format("Stock insuficiente para el producto '%s'. Stock disponible: %d, solicitado: %d",
                                product.getName(), product.getStock(), detailReq.getQuantity()));
            }

            // Calcular subtotal
            double subtotal = product.getPrice() * detailReq.getQuantity();
            totalAmount += subtotal;

            // Crear detalle de orden (temporal para la proforma)
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setProduct(product);
            orderDetail.setQuantity(detailReq.getQuantity());
            orderDetail.setSubTotal(subtotal);

            orderDetails.add(orderDetail);
        }

        // Crear o buscar cliente
        Client client = createOrFindClient(order.getClient());

        // Crear proforma
        Proforma proforma = new Proforma();
        proforma.setSeller(seller);
        proforma.setClient(client);
        proforma.setTotal(totalAmount);

        // Guardar proforma
        Proforma savedProforma = proformaRepository.save(proforma);

        // Asignar proforma a los detalles y guardar
        for (OrderDetail detail : orderDetails) {
            detail.setProforma(savedProforma);
        }
        orderDetailRepository.saveAll(orderDetails);

        // Actualizar la proforma con los detalles
        savedProforma.setOrderDetails(orderDetails);

        // Convertir a DTO respuesta
     //   ProformaDto proformaDto = new ProformaDto();
     //   BeanUtils.copyProperties(savedProforma, proformaDto);

        return ProformaDto.toDto(savedProforma);
    }

    @Override
    @Transactional
    public ProformaDto updateOrder(Long idOrder, ProformaReqDto order, Long idSeller) {
        // Buscar proforma existente
        Proforma existingProforma = proformaRepository.findById(idOrder)
                .orElseThrow(() -> new IllegalArgumentException("No existe proforma con id: " + idOrder));

        // Validar que el vendedor sea el propietario
        if (!existingProforma.getSeller().getId().equals(idSeller)) {
            throw new IllegalArgumentException("No tiene permisos para modificar esta proforma");
        }

        // Validar que haya productos
        if (order.getOrderDetails() == null || order.getOrderDetails().isEmpty()) {
            throw new IllegalArgumentException("La proforma debe contener al menos un producto");
        }

        // Eliminar detalles anteriores
        orderDetailRepository.deleteAll(existingProforma.getOrderDetails());
        existingProforma.getOrderDetails().clear();

        // Verificar disponibilidad de nuevos productos
        double totalAmount = 0.0;
        List<OrderDetail> newOrderDetails = new ArrayList<>();

        for (OrderDetailReqDto detailReq : order.getOrderDetails()) {
            if (detailReq.getQuantity() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            Product product = productRepository.findById(detailReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "No existe producto con id: " + detailReq.getProductId()));

            // Verificar disponibilidad (NO descontar stock)
            if (product.getStock() < detailReq.getQuantity()) {
                throw new IllegalArgumentException(
                        String.format("Stock insuficiente para el producto '%s'. Stock disponible: %d, solicitado: %d",
                                product.getName(), product.getStock(), detailReq.getQuantity()));
            }

            double subtotal = product.getPrice() * detailReq.getQuantity();
            totalAmount += subtotal;

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setProduct(product);
            orderDetail.setProforma(existingProforma);
            orderDetail.setQuantity(detailReq.getQuantity());
            orderDetail.setSubTotal(subtotal);

            newOrderDetails.add(orderDetail);
        }

        // Actualizar total y cliente si es necesario
        existingProforma.setTotal(totalAmount);
        if (order.getClient() != null) {
            Client updatedClient = createOrFindClient(order.getClient());
            existingProforma.setClient(updatedClient);
        }

        // Guardar nuevos detalles
        orderDetailRepository.saveAll(newOrderDetails);
        existingProforma.setOrderDetails(newOrderDetails);

        // Guardar proforma actualizada
        Proforma updatedProforma = proformaRepository.save(existingProforma);

        //ProformaDto proformaDto = new ProformaDto();
        //BeanUtils.copyProperties(updatedProforma, proformaDto);

        return ProformaDto.toDto(updatedProforma);
    }

    @Override
    @Transactional
    public void deleteOrder(Long idOrder, Long idSeller) {
        Proforma proforma = proformaRepository.findById(idOrder)
                .orElseThrow(() -> new IllegalArgumentException("No existe proforma con id: " + idOrder));

        // Validar vendedor
        if (!proforma.getSeller().getId().equals(idSeller)) {
            throw new IllegalArgumentException("El vendedor no está autorizado para eliminar esta proforma");
        }

        // Eliminar proforma (cascade eliminará los detalles)
        proformaRepository.delete(proforma);
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